import f1_960 from '../../assets/home/derived/f1-960.webp'
import f1_1600 from '../../assets/home/derived/f1-1600.webp'
import f1_2560 from '../../assets/home/derived/f1-2560.webp'
import m4_960 from '../../assets/home/derived/m4-960.webp'
import m4_1600 from '../../assets/home/derived/m4-1600.webp'
import m4_2560 from '../../assets/home/derived/m4-2560.webp'
import colnago_960 from '../../assets/home/derived/colnago-960.webp'
import colnago_1600 from '../../assets/home/derived/colnago-1600.webp'
import colnago_2560 from '../../assets/home/derived/colnago-2560.webp'
import fish_960 from '../../assets/home/derived/fish-960.webp'
import fish_1600 from '../../assets/home/derived/fish-1600.webp'
import fish_2560 from '../../assets/home/derived/fish-2560.webp'
import photo_960 from '../../assets/home/derived/photo-960.webp'
import photo_1600 from '../../assets/home/derived/photo-1600.webp'
import photo_2560 from '../../assets/home/derived/photo-2560.webp'

export const HOME_THEMES = [
  {
    id: 'racing',
    word: 'F1',
    route: '/racing',
    matte: [24, 54, 56],
    focus: '50% 52%',
    effect: 'f1',
    sources: [
      { src: f1_960, width: 960 },
      { src: f1_1600, width: 1600 },
      { src: f1_2560, width: 2560 },
    ],
  },
  {
    id: 'cars',
    word: 'M4',
    route: '/cars',
    matte: [141, 116, 31],
    focus: '50% 49%',
    effect: 'm4',
    sources: [
      { src: m4_960, width: 960 },
      { src: m4_1600, width: 1600 },
      { src: m4_2560, width: 2560 },
    ],
  },
  {
    id: 'bikes',
    word: 'COLNAGO',
    route: '/bikes',
    matte: [182, 190, 190],
    focus: '43% 55%',
    effect: 'colnago',
    sources: [
      { src: colnago_960, width: 960 },
      { src: colnago_1600, width: 1600 },
      { src: colnago_2560, width: 2560 },
    ],
  },
  {
    id: 'aqua',
    word: 'FISH',
    route: '/aqua',
    matte: [16, 45, 42],
    focus: '50% 54%',
    effect: 'fish',
    sources: [
      { src: fish_960, width: 960 },
      { src: fish_1600, width: 1600 },
      { src: fish_2560, width: 2560 },
    ],
  },
  {
    id: 'photo',
    word: 'PHOTO',
    route: '/photo',
    matte: [17, 56, 88],
    focus: '54% 48%',
    effect: 'photo',
    sources: [
      { src: photo_960, width: 960 },
      { src: photo_1600, width: 1600 },
      { src: photo_2560, width: 2560 },
    ],
  },
]
