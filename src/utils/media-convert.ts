import { Actions } from "@/types/action";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

/**
 * Extracts the file extension from a file name.
 * @param fileName - The name of the file.
 * @returns The file extension.
 */
function getFileExtension(fileName: string): string {
	const match = fileName.match(/\.([^.]+)$/);
	return match ? match[1] : "";
}

/**
 * Removes the file extension from a file name.
 * @param fileName - The name of the file.
 * @returns The file name without the extension.
 */
function removeFileExtension(fileName: string): string {
	return fileName.replace(/\.[^.]+$/, "");
}

/**
 * Converts a file using FFmpeg.
 * @param ffmpeg - The FFmpeg instance.
 * @param action - The action containing file details.
 * @returns An object with the URL and output file name.
 */

export default async function convert(
	ffmpeg: FFmpeg,
	action: Actions
): Promise<{ url: string; output: string }> {
	const { file, to, file_name, file_type } = action;
	const inputExt = getFileExtension(file_name);
	const output = `${removeFileExtension(file_name)}.${to}`;

	await ffmpeg.writeFile(inputExt, await fetchFile(file));

	const ffmpegCmd =
		to === "3gp"
			? [
					"-i",
					inputExt,
					"-r",
					"20",
					"-s",
					"352x288",
					"-vb",
					"400k",
					"-acodec",
					"aac",
					"-strict",
					"experimental",
					"-ac",
					"1",
					"-ar",
					"8000",
					"-ab",
					"24k",
					output,
			  ]
			: ["-i", inputExt, output];

	await ffmpeg.exec(ffmpegCmd);

	const data = await ffmpeg.readFile(output);
	const isBinary = typeof data !== "string";
	const blobData = isBinary ? new Uint8Array(data.buffer as ArrayBuffer) : data;
	const blob = new Blob([blobData as BlobPart], { type: file_type.split("/")[0] });
	const url = URL.createObjectURL(blob);

	return { url, output };
}
