import React, { useState, useRef } from 'react';
import '../VPlayer.css'; // Import the CSS file
import HasvideoGotaudio from './HasvideoGotAudio'; // Import the HasvideoGotaudio function

const VPlayer = () => {
	const videoRef = useRef();
	const canvasRef = useRef();
	const [isPlaying, setIsPlaying] = useState(false);
	const [videoMetadata, setVideoMetadata] = useState({
		duration: 0,
		width: 0,
		height: 0,
	});
	const [hasAudio, setHasAudio] = useState(null); // To track whether the video has audio

	const loadVideo = async (event) => {
		const file = event.target.files[0];

		if (file) {
			const fileURL = URL.createObjectURL(file);

			// Check if the video has audio tracks
			try {
				const hasAudio = await HasvideoGotaudio(fileURL);
				setHasAudio(hasAudio);

				if (!hasAudio) {
					// If no audio, reset video source to prevent rendering it on the canvas
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
				alert('The Following Video doesnot have audio'); // Set to false if there's an error
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
						</div>
					</>
				)}
			</div>

			<div className='video-info'>
				<p>Duration: {videoMetadata.duration.toFixed(2)} seconds</p>
				<p>
					Dimensions: {videoMetadata.width} x {videoMetadata.height}
				</p>
				{hasAudio !== null && hasAudio !== false && <p>Has Audio: Yes</p>}
			</div>
		</div>
	);
};

export default VPlayer;
