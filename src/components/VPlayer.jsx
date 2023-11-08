import React, { useState, useRef } from 'react';

import '../VPlayer.css'; // Import the CSS file

const VPlayer = () => {
	const videoRef = useRef();

	const canvasRef = useRef();

	const [isPlaying, setIsPlaying] = useState(false);

	const [videoMetadata, setVideoMetadata] = useState({
		duration: 0,

		width: 0,

		height: 0,
	});

	const loadVideo = (event) => {
		const file = event.target.files[0];

		if (file) {
			const fileURL = URL.createObjectURL(file);

			videoRef.current.src = fileURL;

			// Check if the video has audio tracks

			// Update video metadata (duration, width, height)

			videoRef.current.onloadedmetadata = () => {
				const duration = videoRef.current.duration;

				const width = videoRef.current.videoWidth;

				const height = videoRef.current.videoHeight;

				setVideoMetadata({ duration, width, height });
			};
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

			{/* <label for='file'>Choose a file</label> */}

			<div className='video-container'>
				<canvas ref={canvasRef} width={650} height={460}></canvas>

				<div className='video-wrapper'>
					<video ref={videoRef} controls={false} onClick={togglePlay} />
				</div>
			</div>

			<div className='video-info'>
				<p>Duration: {videoMetadata.duration.toFixed(2)} seconds</p>

				<p>
					Dimensions: {videoMetadata.width} x {videoMetadata.height}
				</p>
			</div>
		</div>
	);
};

export default VPlayer;
