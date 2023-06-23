export const airports: Array<[string, number, number]> = [
    ['EDAB', 51.193, 14.52],
    ['EDAC', 50.982, 12.506],
    ['EDAD', 51.832, 12.186],
    ['EDAE', 52.197, 14.586],
    ['EDAH', 53.879, 14.152],
    ['EDAK', 51.308, 13.555],
    ['EDAM', 51.363, 11.941],
    ['EDAQ', 51.552, 12.053],
    ['EDAU', 51.294, 13.359],
    ['EDAX', 53.306, 12.753],
    ['EDAY', 52.58, 13.916],
    ['EDAZ', 52.203, 13.159],
    ['EDBC', 51.856, 11.418],
    ['EDBG', 35.461, -77.965],
    ['EDBH', 54.338, 12.71],
    ['EDBJ', 50.917, 11.714],
    ['EDBK', 52.919, 12.425],
    ['EDBM', 52.074, 11.626],
    ['EDBN', 51.328, 12.657],
    ['EDBR', 51.364, 14.952],
    ['EDCA', 53.833, 13.669],
    ['EDCD', 51.889, 14.532],
    ['EDCK', 51.721, 11.962],
    ['EDCM', 51.296, 14.129],
    ['EDDB', 52.38, 13.523],
    ['EDDC', 51.133, 13.767],
    ['EDDE', 50.98, 10.958],
    ['EDDF', 50.026, 8.543],
    ['EDDG', 52.134, 7.685],
    ['EDDH', 53.63, 9.988],
    ['EDDI', 52.473, 13.404],
    ['EDDK', 50.866, 7.143],
    ['EDDL', 51.289, 6.767],
    ['EDDM', 48.354, 11.786],
    ['EDDN', 49.499, 11.078],
    ['EDDP', 51.424, 12.236],
    ['EDDR', 49.214, 7.109],
    ['EDDS', 48.69, 9.222],
    ['EDDT', 52.559, 13.287],
    ['EDDV', 52.461, 9.685],
    ['EDDW', 53.047, 8.787],
    ['EDFE', 49.961, 8.644],
    ['EDFH', 49.95, 7.264],
    ['EDFM', 49.473, 8.514],
    ['EDFQ', 51.035, 8.679],
    ['EDFV', 49.606, 8.368],
    ['EDFZ', 49.969, 8.147],
    ['EDGE', 50.993, 10.473],
    ['EDGS', 50.708, 8.082],
    ['EDHI', 53.535, 9.835],
    ['EDHK', 54.379, 10.145],
    ['EDHL', 53.805, 10.719],
    ['EDKA', 50.823, 6.187],
    ['EDKV', 50.406, 6.528],
    ['EDKZ', 51.099, 7.602],
    ['EDLA', 51.483, 7.899],
    ['EDLC', 51.53, 6.537],
    ['EDLE', 51.401, 6.936],
    ['EDLN', 51.23, 6.504],
    ['EDLP', 51.614, 8.616],
    ['EDLS', 51.996, 6.84],
    ['EDLW', 51.518, 7.612],
    ['EDMA', 48.425, 10.932],
    ['EDMB', 48.111, 9.763],
    ['EDME', 48.396, 12.724],
    ['EDMO', 48.081, 11.283],
    ['EDMS', 48.901, 12.518],
    ['EDMV', 48.636, 13.195],
    ['EDNL', 47.859, 10.014],
    ['EDNY', 47.671, 9.511],
    ['EDOP', 53.427, 11.783],
    ['EDOV', 52.629, 11.82],
    ['EDPA', 48.778, 10.264],
    ['EDQC', 50.263, 10.996],
    ['EDQD', 49.984, 11.638],
    ['EDQE', 49.794, 11.132],
    ['EDQM', 50.289, 11.855],
    ['EDQP', 49.863, 11.788],
    ['EDQT', 50.018, 10.529],
    ['EDRK', 50.325, 7.531],
    ['EDRT', 49.863, 6.789],
    ['EDRY', 49.302, 8.451],
    ['EDRZ', 49.209, 7.401],
    ['EDTB', 48.791, 8.187],
    ['EDTD', 47.973, 8.522],
    ['EDTF', 48.02, 7.834],
    ['EDTK', 48.982, 8.333],
    ['EDTM', 48.054, 9.373],
    ['EDTY', 49.118, 9.777],
    ['EDUS', 51.608, 13.738],
    ['EDVE', 52.319, 10.556],
    ['EDVK', 51.408, 9.378],
    ['EDVM', 52.177, 9.946],
    ['EDWB', 53.503, 8.573],
    ['EDWD', 53.143, 8.623],
    ['EDWE', 53.391, 7.227],
    ['EDWF', 53.272, 7.443],
    ['EDWI', 53.505, 8.053],
    ['EDWR', 53.595, 6.709],
    ['EDWY', 53.707, 7.23],
    ['EDXF', 54.772, 9.378],
    ['EDXR', 54.221, 9.601],
    ['EDXW', 54.913, 8.34],
];

export function getAirportsMap(): Record<string, [number, number]> {
    return airports.reduce((acc, cur) => ({ ...acc, [cur[0]]: [cur[1], cur[2]] }), {});
}
