// main video player component
import React, { useState, useRef, useEffect } from 'react';
import HasvideoGotaudio from './HasvideoGotAudio';
import WaveSurferPlayer from './WaveformPlayer';
import Timeline from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/timeline.esm.js';
import '../VPlayer.css';

const VPlayer = () => {
	const videoRef = useRef();
	const canvasRef = useRef();
	const waveSurferRef = useRef();
	const [isPlaying, setIsPlaying] = useState(false);
	const [videoMetadata, setVideoMetadata] = useState({
		duration: 0,
		width: 0,
		height: 0,
	});
	const [hasAudio, setHasAudio] = useState(null); // To track whether the video has audio

	useEffect(() => {
		if (waveSurferRef.current && videoRef.current) {
			if (isPlaying) {
				videoRef.current.play();
				waveSurferRef.current.play();
			} else {
				videoRef.current.pause();
				waveSurferRef.current.pause();
			}
		}
	}, [isPlaying]);

	const loadVideo = async (event) => {
		const file = event.target.files[0];

		if (file) {
			const fileURL = URL.createObjectURL(file);

			// Check if the video has audio tracks
			try {
				const hasAudio = await HasvideoGotaudio(fileURL);
				setHasAudio(hasAudio);

				if (!hasAudio) {
					videoRef.current.src = '';
				} else {
					// Set the video source only if it has audio
					videoRef.current.src = fileURL;

					// Update video metadata (duration, width, height)
					videoRef.current.onloadedmetadata = () => {
						const duration = videoRef.current.duration;
						const width = videoRef.current.videoWidth;
						const height = videoRef.current.videoHeight;
						setVideoMetadata({ duration, width, height });
					};
				}
			} catch (error) {
				console.error('Error checking for audio:', error);
				setHasAudio(false);
				alert('Please Upload The Video Having Audio'); // Set to false if there's an error
			}
		}
	};

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}

			setIsPlaying(!isPlaying);
		}
	};

	return (
		<div className='vplayer-container'>
			{!videoRef.current?.src && (
				<div class='container'>
					<div class='title'>
						<h1>Your Video Player</h1>
					</div>
					<div class='ghost'>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			)}
			<label htmlFor='file' className='codepen-button'>
				<input
					type='file'
					id='file'
					className='inputfile'
					accept='video/*'
					onChange={loadVideo}
				/>
				<span>Choose a file</span>
			</label>

			<div className='video-container'>
				{hasAudio === false ? (
					<canvas ref={canvasRef} width={650} height={460}>
						<p className='error-message'>This video has no audio.</p>
					</canvas>
				) : (
					<>
						<canvas ref={canvasRef} width={650} height={460}></canvas>
						<div className='video-wrapper'>
							<video ref={videoRef} controls={false} onClick={togglePlay} />
							<svg
								className={`play-pause-svg ${isPlaying ? 'playing' : 'paused'}`}
								onClick={togglePlay}
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								style={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									width: '50px',
									height: '50px',
								}}
							>
								{isPlaying ? (
									<path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
								) : (
									<path d='M8 5v14l11-7z' />
								)}
							</svg>
						</div>
					</>
				)}
			</div>

			<div className='video-info'>
				<p>Click On Canvas To Play/Pause The Video</p>
				<p>Duration: {videoMetadata.duration.toFixed(2)} seconds</p>
				<p>
					Dimensions: {videoMetadata.width} x {videoMetadata.height}
				</p>
				{hasAudio !== null && hasAudio !== false && <p>Has Audio: Yes</p>}
			</div>
			{hasAudio && (
				<div className='audio-waveform-container'>
					<div className='waveform-header'>
						<h2>Waveform Animation For The Audio Of The Video:</h2>
					</div>

					<WaveSurferPlayer
						height={130}
						waveColor='black'
						progressColor='rgb(255, 165, 0)'
						url={videoRef.current?.src}
						plugins={[Timeline.create()]}
						ref={waveSurferRef}
					/>
				</div>
			)}
		</div>
	);
};

export default VPlayer;
