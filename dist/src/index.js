"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID3v2 = void 0;
var promises_1 = require("fs/promises");
var iconv = require("iconv-lite");
/*
 * Reading of ID3 tag based on http://id3.org/
 */
var ID3v1Genres = [
    'Blues',
    'Classic Rock',
    'Country',
    'Dance',
    'Disco',
    'Funk',
    'Grunge',
    'Hip-Hop',
    'Jazz',
    'Metal',
    'New Age',
    'Oldies',
    'Other',
    'Pop',
    'Rhythm and Blues',
    'Rap',
    'Reggae',
    'Rock',
    'Techno',
    'Industrial',
    'Alternative',
    'Ska',
    'Death Metal',
    'Pranks',
    'Soundtrack',
    'Euro-Techno',
    'Ambient',
    'Trip-Hop',
    'Vocal',
    'Jazz & Funk',
    'Fusion',
    'Trance',
    'Classical',
    'Instrumental',
    'Acid',
    'House',
    'Game',
    'Sound Clip',
    'Gospel',
    'Noise',
    'Alternative Rock',
    'Bass',
    'Soul',
    'Punk',
    'Space',
    'Meditative',
    'Instrumental Pop',
    'Instrumental Rock',
    'Ethnic',
    'Gothic',
    'Darkwave',
    'Techno-Industrial',
    'Electronic',
    'Pop-Folk',
    'Eurodance',
    'Dream',
    'Southern Rock',
    'Comedy',
    'Cult',
    'Gangsta',
    'Top 40',
    'Christian Rap',
    'Pop/Funk',
    'Jungle',
    'Native US',
    'Cabaret',
    'New Wave',
    'Psychedelic',
    'Rave',
    'Showtunes',
    'Trailer',
    'Lo-Fi',
    'Tribal',
    'Acid Punk',
    'Acid Jazz',
    'Polka',
    'Retro',
    'Musical',
    'Rock ’n’ Roll',
    'Hard Rock'
];
var ID3HeaderOffsets;
(function (ID3HeaderOffsets) {
    ID3HeaderOffsets[ID3HeaderOffsets["MAGIC"] = 0] = "MAGIC";
    ID3HeaderOffsets[ID3HeaderOffsets["MAJOR_VERSION"] = 3] = "MAJOR_VERSION";
    ID3HeaderOffsets[ID3HeaderOffsets["MINOR_VERSION"] = 4] = "MINOR_VERSION";
    ID3HeaderOffsets[ID3HeaderOffsets["FLAGS"] = 5] = "FLAGS";
    ID3HeaderOffsets[ID3HeaderOffsets["SIZE"] = 6] = "SIZE";
    ID3HeaderOffsets[ID3HeaderOffsets["END_OF_HEADER"] = 10] = "END_OF_HEADER";
})(ID3HeaderOffsets || (ID3HeaderOffsets = {}));
var ID3HeaderFlags;
(function (ID3HeaderFlags) {
    ID3HeaderFlags[ID3HeaderFlags["Unsynchronisation"] = 128] = "Unsynchronisation";
    ID3HeaderFlags[ID3HeaderFlags["Extended"] = 64] = "Extended";
    ID3HeaderFlags[ID3HeaderFlags["Experimental"] = 32] = "Experimental";
    ID3HeaderFlags[ID3HeaderFlags["Footer"] = 16] = "Footer";
    ID3HeaderFlags[ID3HeaderFlags["Others"] = 15] = "Others"; // 00001111
})(ID3HeaderFlags || (ID3HeaderFlags = {}));
var ID3ExtendedHeaderOffsets;
(function (ID3ExtendedHeaderOffsets) {
    ID3ExtendedHeaderOffsets[ID3ExtendedHeaderOffsets["SIZE"] = 0] = "SIZE";
    ID3ExtendedHeaderOffsets[ID3ExtendedHeaderOffsets["NUMBER_OF_FLAGS"] = 4] = "NUMBER_OF_FLAGS";
    ID3ExtendedHeaderOffsets[ID3ExtendedHeaderOffsets["FLAGS"] = 5] = "FLAGS";
    // END_OF_HEADER depends on NUMBER_OF_FLAGS
})(ID3ExtendedHeaderOffsets || (ID3ExtendedHeaderOffsets = {}));
var ID3FrameOffsets;
(function (ID3FrameOffsets) {
    ID3FrameOffsets[ID3FrameOffsets["ID"] = 0] = "ID";
    ID3FrameOffsets[ID3FrameOffsets["SIZE"] = 4] = "SIZE";
    ID3FrameOffsets[ID3FrameOffsets["FLAGS"] = 8] = "FLAGS";
    ID3FrameOffsets[ID3FrameOffsets["END_OF_HEADER"] = 10] = "END_OF_HEADER";
})(ID3FrameOffsets || (ID3FrameOffsets = {}));
var ID3FrameFlags;
(function (ID3FrameFlags) {
    ID3FrameFlags[ID3FrameFlags["Grouping"] = 64] = "Grouping";
    ID3FrameFlags[ID3FrameFlags["Compression"] = 8] = "Compression";
    ID3FrameFlags[ID3FrameFlags["Encryption"] = 4] = "Encryption";
    ID3FrameFlags[ID3FrameFlags["Unsynchronisation"] = 2] = "Unsynchronisation";
    ID3FrameFlags[ID3FrameFlags["DataLengthIndicator"] = 1] = "DataLengthIndicator"; // 00000000 00000001
})(ID3FrameFlags || (ID3FrameFlags = {}));
var hasFlag = function (flags, flag) { return (flags & flag) === flag; };
var unsyncedLength = function (input) {
    return (input & 127) +
        ((input & (127 << 8)) >> 1) +
        ((input & (127 << 16)) >> 1) +
        ((input & (127 << 24)) >>> 1);
};
var isID3 = function (buffer) {
    return buffer
        .slice(ID3HeaderOffsets.MAGIC, ID3HeaderOffsets.MAGIC + 3)
        .toString() === 'ID3';
};
var isID3v24 = function (buffer) {
    return buffer.readIntBE(ID3HeaderOffsets.MAJOR_VERSION, 1) <= 4;
};
var getID3HeaderFlags = function (buffer) {
    var flags = buffer.readIntBE(ID3HeaderOffsets.FLAGS, 1);
    return {
        unsynchronisation: hasFlag(flags, ID3HeaderFlags.Unsynchronisation),
        extendedHeader: hasFlag(flags, ID3HeaderFlags.Extended),
        experimental: hasFlag(flags, ID3HeaderFlags.Experimental),
        footer: hasFlag(flags, ID3HeaderFlags.Footer),
        others: (flags & ID3HeaderFlags.Others) !== 0
    };
};
var isPadding = function (buffer) { return buffer.readUInt32BE(0) === 0; };
var getID3FrameFlags = function (buffer) {
    var flags = buffer.readInt16BE(ID3FrameOffsets.FLAGS);
    return {
        grouping: hasFlag(flags, ID3FrameFlags.Grouping),
        compression: hasFlag(flags, ID3FrameFlags.Compression),
        encryption: hasFlag(flags, ID3FrameFlags.Encryption),
        unsynchronisation: hasFlag(flags, ID3FrameFlags.Unsynchronisation),
        dataLengthIndicator: hasFlag(flags, ID3FrameFlags.DataLengthIndicator)
    };
};
// tslint:disable-next-line cyclomatic-complexity
var getFrameData = function (buffer) {
    var name = buffer
        .slice(ID3FrameOffsets.ID, ID3FrameOffsets.ID + 4)
        .toString();
    var length = unsyncedLength(buffer.readInt32BE(ID3FrameOffsets.SIZE));
    var encoding = (function () {
        var value = buffer.readInt8(ID3FrameOffsets.END_OF_HEADER);
        switch (value) {
            case 0:
                return 'ISO-8859-1';
            case 1:
                return 'UTF-16';
            case 2:
                return 'UTF-16';
            case 3:
                return 'UTF-8';
        }
        return '';
    })();
    var data;
    switch (name) {
        case 'TXXX':
            {
                var idx = buffer.indexOf(0, ID3FrameOffsets.END_OF_HEADER + 1);
                var description = iconv.decode(buffer.slice(ID3FrameOffsets.END_OF_HEADER + 1, idx), encoding);
                data = {
                    description: description,
                    value: iconv.decode(buffer.slice(ID3FrameOffsets.END_OF_HEADER + 1 + description.length + 1, ID3FrameOffsets.END_OF_HEADER + length), encoding)
                };
            }
            break;
        case 'TPOS':
        case 'TLEN':
        case 'TYER':
        case 'TSSE':
        case 'TCON':
        case 'TRCK':
        case 'TALB':
        case 'TIT2':
        case 'TDRC':
        case 'TPE1':
        case 'TPE2':
            data = iconv.decode(buffer.slice(ID3FrameOffsets.END_OF_HEADER + 1, ID3FrameOffsets.END_OF_HEADER + length), encoding);
            break;
        case 'POPM':
            {
                var idx = buffer.indexOf(0, ID3FrameOffsets.END_OF_HEADER);
                var email = buffer
                    .slice(ID3FrameOffsets.END_OF_HEADER, idx)
                    .toString();
                var rating = buffer.readUInt8(idx + 1);
                // TODO: counter
                data = {
                    email: email,
                    rating: rating,
                    counter: undefined
                };
            }
            break;
        case 'UFID':
            {
                var idx = buffer.indexOf(0, ID3FrameOffsets.END_OF_HEADER);
                var ownerIdentifier = buffer
                    .slice(ID3FrameOffsets.END_OF_HEADER, idx)
                    .toString();
                data = {
                    ownerIdentifier: ownerIdentifier,
                    identifier: buffer.slice(ID3FrameOffsets.END_OF_HEADER + ownerIdentifier.length, length)
                };
            }
            break;
    }
    return {
        name: name,
        length: length,
        flags: getID3FrameFlags(buffer),
        data: data
    };
};
var ID3v2 = /** @class */ (function () {
    // tslint:disable-next-line cyclomatic-complexity
    function ID3v2(buffer) {
        this.frames = {};
        if (!isID3(buffer) || !isID3v24(buffer)) {
            return;
        }
        this.flags = getID3HeaderFlags(buffer);
        if (this.flags.others) {
            return;
        }
        var size = unsyncedLength(buffer.readInt32BE(ID3HeaderOffsets.SIZE));
        var startOfFrame = ID3HeaderOffsets.END_OF_HEADER;
        if (this.flags.extendedHeader) {
            var extendedHeaderBuffer = buffer.slice(ID3HeaderOffsets.END_OF_HEADER);
            var extendedHeaderSize = unsyncedLength(extendedHeaderBuffer.readInt32BE(ID3ExtendedHeaderOffsets.SIZE));
            startOfFrame += extendedHeaderSize;
        }
        while (startOfFrame < size) {
            var frameBuffer = buffer.slice(startOfFrame);
            try {
                if (isPadding(frameBuffer)) {
                    break;
                }
            }
            catch (_a) {
                break;
            }
            var frame = getFrameData(frameBuffer);
            if (this.frames[frame.name]) {
                if (!Array.isArray(this.frames[frame.name])) {
                    this.frames[frame.name] = [this.frames[frame.name]];
                }
                this.frames[frame.name].push(frame);
            }
            else {
                this.frames[frame.name] = frame;
            }
            startOfFrame += ID3FrameOffsets.END_OF_HEADER + frame.length;
        }
    }
    ID3v2.read = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, promises_1.readFile)(path)];
                    case 1:
                        buffer = _a.sent();
                        return [2 /*return*/, new this(buffer)];
                }
            });
        });
    };
    ID3v2.prototype.getFrameData = function (name) {
        var frame = this.frames[name];
        if (Array.isArray(frame)) {
            return frame.map(function (entry) { return entry.data; });
        }
        return frame ? frame.data : undefined;
    };
    Object.defineProperty(ID3v2.prototype, "ufid", {
        get: function () {
            return this.getFrameData('UFID');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "genre", {
        get: function () {
            var genre = this.getFrameData('TCON');
            if (genre) {
                var idx = parseInt(genre.replace(/[\(\)]/g, ''), 10);
                if (idx <= ID3v1Genres.length) {
                    genre = ID3v1Genres[idx];
                }
            }
            return genre;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "track", {
        get: function () {
            return this.getFrameData('TRCK');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "album", {
        get: function () {
            return this.getFrameData('TALB');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "title", {
        get: function () {
            return this.getFrameData('TIT2');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "year", {
        get: function () {
            return this.getFrameData('TDRC') || this.getFrameData('TYER');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "artist", {
        get: function () {
            return this.getFrameData('TPE1');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "popularimeter", {
        get: function () {
            return this.getFrameData('POPM');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "length", {
        get: function () {
            return this.getFrameData('TLEN');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "set", {
        get: function () {
            return this.getFrameData('TPOS');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ID3v2.prototype, "text", {
        get: function () {
            return this.getFrameData('TXXX');
        },
        enumerable: false,
        configurable: true
    });
    return ID3v2;
}());
exports.ID3v2 = ID3v2;
//# sourceMappingURL=index.js.map