import React from 'react';
import Typewriter from 'typewriter-effect';
import SearchBar from '../../components/search-bar/search-bar.component';
import './homepage.styles.css';

export default function Homepage() {
  return (
    <div className='homepage'>
      <h1>
        <Typewriter
          options={{
            strings: ['Dictionary App', 'Find Meanings', 'Learn Pronunciation', 'Explore Synonyms'],
            autoStart: true,
            loop: true,
            delay: 75,
          }}
        />
      </h1>
      <p style={{ textAlign: 'center' }}>Define your world, one word at a time.</p>

      <div className="search-container">
        <SearchBar />
      </div>

      <br /><br />
    </div>
  )
}