import React from 'react';
import VPlayer from './VPlayer';
import '../index.css';

const Home = () => {
	return (
		<div>
			<div class='container'>
				<div class='title'>
					<h1>Your Video Player</h1>
				</div>
				<div class='ghost'></div>
			</div>
			<VPlayer />
		</div>
	);
};

export default Home;
