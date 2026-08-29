# 把 public/images 下（除 photos/ 外）的所有图片统一合成为"产品渲染图"：
# AI 抠图主体 -> 模块主题色摄影棚渐变背景 + 聚光灯 + 地面倒影 + 柔和投影
import os, sys, glob
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from rembg import remove, new_session

ROOT = r"C:\Users\24939\.zcode\workspace\default\gyh-site\public\images"
ONLY = sys.argv[1] if len(sys.argv) > 1 else ""  # 可传子目录只处理一部分

# 主题舞台配置：top/bottom 渐变色、聚光色、是否倒影
THEMES = {
    "racing":  dict(top=(32, 34, 38),  bottom=(10, 11, 13), glow=(200, 55, 45),  refl=True),
    "cars":    dict(top=(38, 33, 26),  bottom=(11, 10, 8),  glow=(176, 138, 74), refl=True),
    "bikes":   dict(top=(250, 251, 249), bottom=(223, 227, 221), glow=(255, 255, 255), refl=True),
    "cameras": dict(top=(248, 246, 240), bottom=(226, 223, 214), glow=(255, 255, 255), refl=True),
    "fish":    dict(top=(13, 42, 56),  bottom=(6, 22, 32),  glow=(63, 184, 175), refl=True),
}
ASPECT = {  # 输出画布宽高比（宽固定 1600）
    "racing/f1": (16, 10), "racing/gt3": (4, 3), "racing/drivers": (4, 3),
    "cars": (16, 10), "bikes": (16, 10), "cameras": (4, 3), "fish": (4, 3),
}

def theme_for(rel):
    top = rel.split("/")[0]
    if rel.startswith("photos/"):
        return None
    return top

def aspect_for(rel):
    for k, v in ASPECT.items():
        if rel.startswith(k):
            return v
    return (16, 10)

def vertical_gradient(w, h, top, bottom):
    t = np.linspace(0, 1, h)[:, None, None]
    grad = (np.array(top)[None, None, :] * (1 - t) + np.array(bottom)[None, None, :] * t)
    return np.repeat(grad, w, axis=1).astype(np.float32)

def radial_spot(w, h, cx, cy, radius, color, strength):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((x - cx) / radius) ** 2 + ((y - cy) / (radius * 0.85)) ** 2)
    mask = np.clip(1 - d, 0, 1) ** 2 * strength
    return mask[:, :, None] * np.array(color, dtype=np.float32)[None, None, :]

def make_stage(w, h, th):
    base = vertical_gradient(w, h, th["top"], th["bottom"])
    # 聚光灯
    base += radial_spot(w, h, w * 0.5, h * 0.42, w * 0.52, th["glow"], 0.30)
    # 地面：底部略暗 + 一条浅浅的地平线光
    yy = np.linspace(0, 1, h)[:, None, None]
    floor = np.clip((yy - 0.72) / 0.28, 0, 1) * np.array([0, 0, 0], dtype=np.float32)[None, None, :] * 0.25
    base *= (1 - floor)
    base += radial_spot(w, h, w * 0.5, h * 0.74, w * 0.42, th["glow"], 0.10)
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB")

def fit_subject(subj, max_w_ratio, max_h_ratio, W, H):
    ratio = min(W * max_w_ratio / subj.width, H * max_h_ratio / subj.height)
    return subj.resize((max(1, int(subj.width * ratio)), max(1, int(subj.height * ratio))), Image.LANCZOS)

def render_one(src, dst, th, aspect, with_reflection):
    img = Image.open(src).convert("RGB")
    cut = remove(img)  # RGBA
    # 裁掉透明边
    bbox = cut.getchannel("A").getbbox()
    if not bbox:
        return False
    cut = cut.crop(bbox)
    W, H = 1600, int(1600 * aspect[1] / aspect[0])
    stage = make_stage(W, H, th)
    subj = fit_subject(cut, 0.80, 0.62, W, H)
    # 底部锚点：主体底边放在画布 84% 高度
    bx = (W - subj.width) // 2
    by = int(H * 0.84) - subj.height
    # 柔和投影
    shadow = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(shadow)
    sw = int(subj.width * 0.46)
    sd.ellipse([W // 2 - sw, by + subj.height - subj.height * 0.015, W // 2 + sw, by + subj.height + subj.height * 0.05], fill=150)
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    dark = Image.new("RGB", (W, H), (0, 0, 0))
    stage = Image.composite(Image.blend(stage, dark, 0.45), stage, shadow)
    # 地面倒影
    if with_reflection:
        refl_h = int(subj.height * 0.32)
        refl = subj.crop((0, subj.height - min(subj.height, int(refl_h / 0.32)), subj.width, subj.height)).transpose(Image.FLIP_TOP_BOTTOM)
        refl = refl.resize((subj.width, refl_h), Image.LANCZOS)
        fade = np.linspace(0.24, 0, refl.height)[:, None]
        a = (np.array(refl.getchannel("A"), dtype=np.float32) * 0.24) * fade
        refl.putalpha(Image.fromarray(a.astype(np.uint8)))
        refl = refl.filter(ImageFilter.GaussianBlur(3))
        stage.paste(refl, (bx, by + subj.height), refl)
    stage.paste(subj, (bx, by), subj)
    stage.save(dst, "JPEG", quality=82, mozjpeg=True) if dst.lower().endswith(".jpg") else stage.save(dst)
    return True

session = new_session()
targets = []
for f in glob.glob(os.path.join(ROOT, "**", "*.*"), recursive=True):
    rel = os.path.relpath(f, ROOT).replace("\\", "/")
    if not rel.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        continue
    if rel.startswith("photos/"):
        continue
    if ONLY and not rel.startswith(ONLY):
        continue
    targets.append((f, rel))
targets.sort()
print("total targets:", len(targets), flush=True)
done = fail = 0
for f, rel in targets:
    th_key = rel.split("/")[0]
    th = THEMES.get(th_key)
    if not th:
        continue
    dst = os.path.splitext(f)[0] + ".jpg"
    try:
        ok = render_one(f, dst, th, aspect_for(rel), with_reflection=(th_key != "fish"))
        if ok and dst != f:
            os.remove(f)
        done += 1
        print(f"[{done+fail}/{len(targets)}] OK  {rel}", flush=True)
    except Exception as e:
        fail += 1
        print(f"[{done+fail}/{len(targets)}] FAIL {rel}: {e}", flush=True)
print("DONE done=%d fail=%d" % (done, fail), flush=True)
