import { _mock } from './_mock';
import { _tags } from './assets';

// ----------------------------------------------------------------------

const FILES = [
    'cover-2.jpg',
    'design-suriname-2015.mp3',
    'expertise-2015-conakry-sao-tome-and-principe-gender.mp4',
    'money-popup-crack.pdf',
    'cover-4.jpg',
    'cover-6.jpg',
    'large-news.txt',
    'nauru-6015-small-fighter-left-gender.psd',
    'tv-xs.doc',
    'gustavia-entertainment-productivity.docx',
    'vintage-bahrain-saipan.xls',
    'indonesia-quito-nancy-grace-left-glad.xlsx',
    'legislation-grain.zip',
    'large-energy-dry-philippines.rar',
    'footer-243-ecuador.iso',
    'kyrgyzstan-04795009-picabo-street-guide-style.ai',
    'india-data-large-gk-chesterton-mother.esp',
    'footer-barbados-celine-dion.ppt',
    'socio-respectively-366996.pptx',
    'socio-ahead-531437-sweden-popup.wav',
    'trinidad-samuel-morse-bring.m4v',
    'cover-12.jpg',
    'cover-18.jpg',
    'xl-david-blaine-component-tanzania-books.pdf',
];

export const FILE_TYPE_OPTIONS = [
    'folder',
    'txt',
    'zip',
    'audio',
    'image',
    'video',
    'word',
    'excel',
    'powerpoint',
    'pdf',
    'photoshop',
    'illustrator',
];

// ----------------------------------------------------------------------
const shared = (index) =>
    (index === 0) ||
    (index === 1) ||
    (index === 2) ||
    (index === 3) ||
    [];


export const _files = FILES.map((name, index) => ({
    id: `${_mock.id(index)}_file`,
    name,
    created: _mock.time(index),
    status: shared(index),
    item_disputed: `${name.split('.').pop()}`,
}));

export const _allDocFiles = [..._files];
