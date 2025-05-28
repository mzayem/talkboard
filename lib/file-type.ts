// lib/fileTypes.ts

const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "bmp",
  "tiff",
  "svg",
  "ico",
  "heic",
  "jfif",
  "pjpeg",
  "pjp",
];

const videoExtensions = [
  "mp4",
  "mov",
  "avi",
  "mkv",
  "webm",
  "flv",
  "wmv",
  "mpeg",
  "mpg",
  "3gp",
  "m4v",
  "ogv",
];

const audioExtensions = [
  "mp3",
  "wav",
  "ogg",
  "aac",
  "flac",
  "m4a",
  "aiff",
  "alac",
  "opus",
  "wma",
];

const pdfExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

const textExtensions = [
  "txt",
  "md",
  "csv",
  "log",
  "xml",
  "json",
  "yaml",
  "yml",
  "ini",
];

const zipExtensions = [
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "bz2",
  "xz",
  "lz",
  "lzma",
];

export const getFileType = (
  filename: string,
): "image" | "video" | "audio" | "pdf" | "text" | "zip" | "unknown" => {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (!ext) return "unknown";
  if (imageExtensions.includes(ext)) return "image";
  if (videoExtensions.includes(ext)) return "video";
  if (audioExtensions.includes(ext)) return "audio";
  if (pdfExtensions.includes(ext)) return "pdf";
  if (textExtensions.includes(ext)) return "text";
  if (zipExtensions.includes(ext)) return "zip";

  return "unknown";
};
