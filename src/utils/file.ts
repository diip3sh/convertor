import { FileType } from "../types/file";

export const isValidFileType = (file: File): FileType | "invalid" => {
	if (file.type.startsWith("image/")) return file.type as FileType;
	if (file.type.startsWith("video/")) return file.type as FileType;
	if (file.type.startsWith("audio/")) return file.type as FileType;
	return "invalid" as FileType;
};

export const isValidFile = (file: File): boolean => {
	const result = isValidFileType(file);
	return result !== "invalid";
};

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
