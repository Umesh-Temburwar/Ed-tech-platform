import {
  extractYouTubeVideoId,
  isValidYouTubeUrl,
  getYoutubeThumbnail,
  extractYouTubeTimestamp,
} from '../youtubeUtils';

describe('youtubeUtils Unit Tests', () => {
  const VIDEO_ID = 'dQw4w9WgXcQ';

  describe('extractYouTubeVideoId', () => {
    test('extracts ID from standard watch URL', () => {
      expect(extractYouTubeVideoId(`https://www.youtube.com/watch?v=${VIDEO_ID}`)).toBe(VIDEO_ID);
    });

    test('extracts ID from shortened youtu.be URL', () => {
      expect(extractYouTubeVideoId(`https://youtu.be/${VIDEO_ID}`)).toBe(VIDEO_ID);
    });

    test('extracts ID from YouTube shorts URL', () => {
      expect(extractYouTubeVideoId(`https://www.youtube.com/shorts/${VIDEO_ID}`)).toBe(VIDEO_ID);
    });

    test('extracts ID from embed URL', () => {
      expect(extractYouTubeVideoId(`https://www.youtube.com/embed/${VIDEO_ID}`)).toBe(VIDEO_ID);
    });

    test('accepts raw 11-char video ID directly', () => {
      expect(extractYouTubeVideoId(VIDEO_ID)).toBe(VIDEO_ID);
    });

    test('returns null for null, empty or invalid strings', () => {
      expect(extractYouTubeVideoId(null)).toBeNull();
      expect(extractYouTubeVideoId('')).toBeNull();
      expect(extractYouTubeVideoId('https://vimeo.com/123456')).toBeNull();
    });
  });

  describe('isValidYouTubeUrl', () => {
    test('validates valid YouTube links', () => {
      expect(isValidYouTubeUrl(`https://www.youtube.com/watch?v=${VIDEO_ID}`)).toBe(true);
    });

    test('invalidates non-YouTube URLs', () => {
      expect(isValidYouTubeUrl('https://example.com/video')).toBe(false);
    });
  });

  describe('getYoutubeThumbnail', () => {
    test('generates maxres thumbnail by default', () => {
      const thumb = getYoutubeThumbnail(`https://youtu.be/${VIDEO_ID}`);
      expect(thumb).toBe(`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`);
    });

    test('generates hq thumbnail when requested', () => {
      const thumb = getYoutubeThumbnail(`https://youtu.be/${VIDEO_ID}`, 'hq');
      expect(thumb).toBe(`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`);
    });
  });

  describe('extractYouTubeTimestamp', () => {
    test('extracts raw seconds', () => {
      expect(extractYouTubeTimestamp('https://youtu.be/abc?t=120')).toBe(120);
    });

    test('extracts minutes and seconds notation', () => {
      expect(extractYouTubeTimestamp('https://youtu.be/abc?t=2m30s')).toBe(150);
    });

    test('returns 0 when no timestamp present', () => {
      expect(extractYouTubeTimestamp('https://youtu.be/abc')).toBe(0);
    });
  });
});
