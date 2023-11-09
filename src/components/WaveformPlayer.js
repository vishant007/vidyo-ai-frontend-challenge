import React, { useRef, useState, useEffect, useCallback } from 'react';
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

const useWavesurfer = (containerRef, options) => {
	const [wavesurfer, setWavesurfer] = useState(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const ws = WaveSurfer.create({
			...options,
			container: containerRef.current,
		});

		setWavesurfer(ws);

		return () => {
			ws.destroy();
		};
	}, [options, containerRef]);

	return wavesurfer;
};

const WaveSurferPlayer = (props) => {
	const containerRef = useRef();
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const wavesurfer = useWavesurfer(containerRef, props);

	const onPlayClick = useCallback(() => {
		wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
	}, [wavesurfer]);

	useEffect(() => {
		if (!wavesurfer) return;

		setCurrentTime(0);
		setIsPlaying(false);

		const subscriptions = [
			wavesurfer.on('play', () => setIsPlaying(true)),
			wavesurfer.on('pause', () => setIsPlaying(false)),
			wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
		];

		return () => {
			subscriptions.forEach((unsub) => unsub());
		};
	}, [wavesurfer]);

	return (
		<>
			<div ref={containerRef} style={{ minHeight: '120px' }} />

			<button
				className='codepen-button'
				onClick={onPlayClick}
				style={{ marginTop: '1em' }}
			>
				<span>{isPlaying ? 'Pause' : 'Play'}</span>
			</button>

			<p>Seconds played: {currentTime}</p>
		</>
	);
};

export default WaveSurferPlayer;
