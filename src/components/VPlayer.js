import React, { useState, useRef } from 'react';
import '../VPlayer.css'; // Import the CSS file

const VPlayer = () => {
	const videoRef = useRef();
	const canvasRef = useRef();
	const [isPlaying, setIsPlaying] = useState(false);

	const loadVideo = (event) => {
		const file = event.target.files[0];

		if (file) {
			const videoURL = URL.createObjectURL(file);
			videoRef.current.src = videoURL;

			// Update video metadata (duration)
			videoRef.current.onloadedmetadata = () => {
				console.log('Video duration:', videoRef.current.duration);
				// You can display the duration on the UI as needed
			};
		}
	};

	const togglePlay = () => {
		if (isPlaying) {
			videoRef.current.pause();
		} else {
			videoRef.current.play();
		}
		setIsPlaying(!isPlaying);
	};

	return (
		<div className='vplayer-container'>
			<input type='file' accept='video/*' onChange={loadVideo} />
			<div className='video-container'>
				<canvas ref={canvasRef} width={640} height={360}></canvas>
				<div className='video-wrapper'>
					<video ref={videoRef} controls={false} onClick={togglePlay} />
				</div>
			</div>
			<button className='play-pause-button' onClick={togglePlay}>
				{isPlaying ? 'Pause' : 'Play'}
			</button>
		</div>
	);
};

export default VPlayer;
