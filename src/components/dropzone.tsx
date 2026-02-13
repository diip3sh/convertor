"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import ReactDropzone from "react-dropzone";
import {
	UploadCloud,
	FileSymlink,
	X,
	Download,
	Loader2,
	AlertCircle,
	CircleCheck,
	Image,
	Music,
	Film,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import { formatFileSize } from "@/utils/file";
import fileToIcon from "@/utils/file-to-icon";
import compressFileName from "@/utils/compress-filenames";
import convertFile from "@/utils/media-convert";
import loadFfmpeg from "@/utils/load-ffmpeg";
import { ACCEPTED_FORMAT, EXTENSIONS } from "@/utils/constant";

import { Actions } from "@/types/action";
import { FilesType } from "@/types/file";

export const MediaZone = () => {
	const { toast } = useToast();
	const [isHover, setIsHover] = useState(false);
	const [actions, setActions] = useState<Actions[]>([]);
	const [isReady, setIsReady] = useState(false);
	const [files, setFiles] = useState<Array<FilesType>>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isConverting, setIsConverting] = useState(false);
	const [isDone, setIsDone] = useState(false);
	const ffmpegRef = useRef<FFmpeg | null>(null);

	const reset = () => {
		setIsDone(false);
		setActions([]);
		setFiles([]);
		setIsReady(false);
		setIsConverting(false);
	};

	useEffect(() => {
		const loadFFmpeg = async () => {
			const ffmpeg = await loadFfmpeg();
			ffmpegRef.current = ffmpeg;
			setIsLoaded(true);
		};
		loadFFmpeg();
	}, []);

	const handleUpload = (acceptedFiles: File[]) => {
		setIsHover(false);
		const filesData = acceptedFiles.map((file): FilesType => ({
			...file,
			file_name: file.name,
			file_size: file.size,
			from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
			to: null,
			file_type: file.type,
			file,
			is_converted: false,
			is_converting: false,
			is_error: false,
		}));
		setFiles(filesData);
		setActions(filesData as Actions[]);
	};

	const convert = async () => {
		const updatedActions = actions.map((action) => ({
			...action,
			is_converting: true,
		}));
		setActions(updatedActions);
		setIsConverting(true);

		for (const action of updatedActions) {
			try {
				if (ffmpegRef.current) {
					const { url, output } = await convertFile(ffmpegRef.current, action);
					setActions((prevActions) =>
						prevActions.map((a) =>
							a === action
								? { ...a, is_converted: true, is_converting: false, url, output }
								: a
						)
					);
				} else {
					console.error("FFmpeg instance is not initialized");
				}
			} catch (err: unknown) {
				console.log(err);
				setActions((prevActions) =>
					prevActions.map((a) =>
						a === action
							? {
									...a,
									is_converted: false,
									is_converting: false,
									is_error: true,
							  }
							: a
					)
				);
			}
		}

		setIsDone(true);
		setIsConverting(false);
	};

	const download = (action: Actions) => {
		const a = document.createElement("a");
		a.style.display = "none";
		a.href = action.url ?? "";
		a.download = action.output ?? "";
		document.body.appendChild(a);
		a.click();
		URL.revokeObjectURL(action.url ?? "");
		document.body.removeChild(a);
	};

	const downloadAll = () => {
		actions.forEach((action) => {
			if (!action.is_error) download(action);
		});
	};

	const updateAction = useCallback((fileName: string, to: string) => {
		setActions((prevActions) => {
			const newActions = prevActions.map((action) =>
				action.file_name === fileName ? { ...action, to } : action
			);
			const allReady = newActions.every((action) => action.to);
			setIsReady(allReady);
			return newActions;
		});
	}, []);

	const deleteAction = useCallback((action: Actions) => {
		setActions((prevActions) => prevActions.filter((a) => a !== action));
		setFiles((prevFiles) =>
			prevFiles.filter((f) => f.name !== action.file_name)
		);
	}, []);

	if (actions.length) {
		return (
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-3 justify-end">
					{isDone ? (
						<div className="flex gap-3">
							<Button
								onClick={reset}
								variant="outline"
								className="rounded-full px-6 h-11 border-muted-foreground/20 hover:bg-muted/50 transition-all duration-200"
							>
								Convert More
							</Button>
							<Button
								onClick={downloadAll}
								className="rounded-full px-6 h-11 font-medium bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 shadow-lg shadow-foreground/10"
							>
								<Download className="w-4 h-4 mr-2" />
								{actions.length > 1 ? "Download All" : "Download"}
							</Button>
						</div>
					) : (
						<Button
							disabled={!isReady || isConverting}
							onClick={convert}
							className="rounded-full px-8 h-11 font-medium bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 shadow-lg shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isConverting ? (
								<span className="flex items-center gap-2">
									<Loader2 className="w-4 h-4 animate-spin" />
									Converting...
								</span>
							) : (
								<span>Convert Now</span>
							)}
						</Button>
					)}
				</div>
				<div className="space-y-3">
					{actions.map((action, index) => (
							<div
								key={`${action.file_name}-${index}`}
								className="group relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:bg-card/80 hover:border-border hover:shadow-xl hover:shadow-foreground/5"
							>
								{!isLoaded && (
									<Skeleton className="absolute inset-0 rounded-2xl" />
								)}
								<div className="relative flex items-center gap-4">
									<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
										<span className="text-primary/70">
											{fileToIcon(action.file_type)}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="font-medium truncate text-foreground">
												{compressFileName(action.file_name)}
											</span>
											<span className="text-muted-foreground text-sm">
												({formatFileSize(action.file_size)})
											</span>
										</div>
										<div className="text-sm text-muted-foreground mt-0.5">
											{action.from.toUpperCase()} → {action.to?.toUpperCase() || "Select format"}
										</div>
									</div>
									<div className="flex items-center gap-3">
										{action.is_error ? (
											<Badge
												variant="destructive"
												className="rounded-full bg-red-500/10 text-red-600 border-red-500/20 px-3"
											>
												<AlertCircle className="w-3.5 h-3.5 mr-1.5" />
												Failed
											</Badge>
										) : action.is_converted ? (
											<Badge
												variant="default"
												className="rounded-full bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3"
											>
												<CircleCheck className="w-3.5 h-3.5 mr-1.5" />
												Done
											</Badge>
										) : action.is_converting ? (
											<Badge
												variant="default"
												className="rounded-full bg-amber-500/10 text-amber-600 border-amber-500/20 px-3"
											>
												<Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
												Converting
											</Badge>
										) : (
											<Select
												value={action.to || ""}
												onValueChange={(value) => {
													updateAction(action.file_name, value);
												}}
											>
												<SelectTrigger className="w-28 h-9 rounded-full border-border/50 bg-background/50 text-sm">
													<SelectValue placeholder="Format" />
												</SelectTrigger>
												<SelectContent className="rounded-xl">
													{action.file_type.includes("image") && (
														<div className="grid grid-cols-3 gap-1 p-2">
															{EXTENSIONS.image.map((ext, i) => (
																<SelectItem
																	key={i}
																	value={ext}
																>
																	{ext}
																</SelectItem>
															))}
														</div>
													)}
													{action.file_type.includes("video") && (
														<Tabs defaultValue="video" className="w-full">
															<TabsList className="w-full rounded-lg">
																<TabsTrigger value="video" className="flex-1 rounded-md">
																	Video
																</TabsTrigger>
																<TabsTrigger value="audio" className="flex-1 rounded-md">
																	Audio
																</TabsTrigger>
															</TabsList>
															<TabsContent value="video" className="p-2">
																<div className="grid grid-cols-3 gap-1">
																	{EXTENSIONS.video.map((ext, i) => (
																		<SelectItem key={i} value={ext}>
																			{ext}
																		</SelectItem>
																	))}
																</div>
															</TabsContent>
															<TabsContent value="audio" className="p-2">
																<div className="grid grid-cols-2 gap-1">
																	{EXTENSIONS.audio.map((ext, i) => (
																		<SelectItem key={i} value={ext}>
																			{ext}
																		</SelectItem>
																	))}
																</div>
															</TabsContent>
														</Tabs>
													)}
													{action.file_type.includes("audio") && (
														<div className="grid grid-cols-2 gap-1 p-2">
															{EXTENSIONS.audio.map((ext, i) => (
																<SelectItem key={i} value={ext}>
																	{ext}
																</SelectItem>
															))}
														</div>
													)}
												</SelectContent>
											</Select>
										)}
										{action.is_converted ? (
											<Button
												variant="outline"
												size="sm"
												onClick={() => download(action)}
												className="rounded-full h-9 px-4 border-border/50 hover:bg-foreground hover:text-background transition-colors duration-200"
											>
												<Download className="w-4 h-4 mr-1.5" />
												Save
											</Button>
										) : (
											<button
												type="button"
												onClick={() => deleteAction(action)}
												className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full hover:bg-muted"
												aria-label="Remove file"
											>
												<X className="w-4 h-4 text-muted-foreground" />
											</button>
										)}
									</div>
								</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<ReactDropzone
			onDrop={handleUpload}
			onDragEnter={() => setIsHover(true)}
			onDragLeave={() => setIsHover(false)}
			accept={ACCEPTED_FORMAT}
			onDropRejected={() => {
				setIsHover(false);
				toast({
					variant: "destructive",
					title: "Invalid file type",
					description: "Please upload audio, video, or image files only.",
					duration: 4000,
				});
			}}
		>
			{({ getRootProps, getInputProps, isDragActive }) => (
				<div
					{...getRootProps()}
					className={`
						relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 ease-out
						${isDragActive || isHover 
							? "border-primary bg-primary/5 scale-[1.02]" 
							: "border-border/60 hover:border-primary/40 hover:bg-primary/[0.02]"
						}
					`}
				>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center justify-center py-16 px-8 text-center">
						<div 
							className={`
								mb-6 p-5 rounded-3xl transition-all duration-500 ease-out
								${isDragActive || isHover
									? "bg-primary/10 scale-110"
									: "bg-primary/5"
								}
							`}
						>
							{isDragActive || isHover ? (
								<FileSymlink className="w-12 h-12 text-primary transition-transform duration-300" />
							) : (
								<UploadCloud className="w-14 h-14 text-primary/60 transition-transform duration-300" />
							)}
						</div>
						<h3 className="text-xl font-medium text-foreground mb-2">
							{isDragActive 
								? "Drop your files here" 
								: "Drag & drop your media"
							}
						</h3>
						<p className="text-muted-foreground mb-6 max-w-sm">
							{isDragActive 
								? "Release to start converting" 
								: "or click to browse files from your device"
							}
						</p>
						<div className="flex items-center gap-6 text-sm text-muted-foreground/70">
							<span className="flex items-center gap-1.5">
								<Image className="w-4 h-4" />
								Images
							</span>
							<span className="flex items-center gap-1.5">
								<Film className="w-4 h-4" />
								Video
							</span>
							<span className="flex items-center gap-1.5">
								<Music className="w-4 h-4" />
								Audio
							</span>
						</div>
					</div>
				</div>
			)}
		</ReactDropzone>
	);
};
