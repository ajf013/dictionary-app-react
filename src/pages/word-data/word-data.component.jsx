import React from 'react';
import Carousel from '../../components/word-carousel/word-carousel.component';
import Synonyms from '../../components/synonyms/synonyms.component'
import Pronunciation from '../../components/pronunciation/pronunciation.component';
import { ReactComponent as Search } from '../../assets/search.svg';
import './word-data.styles.css';

class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    }
  }

  getMeaning = (word) => {
    this.setState({ data: {} })
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((result) => result.json())
      .then((result) => {
        // Handle array response from new API
        const entry = Array.isArray(result) ? result[0] : result;

        if (!entry || entry.title === "No Definitions Found") {
          this.setState({ data: { error: true } });
          return;
        }

        const senses = [];
        const synonyms = [];

        // Flatten meanings and definitions into senses
        if (entry.meanings) {
          entry.meanings.forEach(meaning => {
            // Collect synonyms from meaning level
            if (meaning.synonyms && meaning.synonyms.length) {
              synonyms.push(...meaning.synonyms);
            }

            if (meaning.definitions) {
              meaning.definitions.forEach(def => {
                senses.push({
                  category: meaning.partOfSpeech,
                  definition: def.definition,
                  examples: def.example ? [def.example] : []
                });
                // Collect synonyms from definition level
                if (def.synonyms && def.synonyms.length) {
                  synonyms.push(...def.synonyms);
                }
              });
            }
          });
        }

        // Find audio
        let audio = '';
        if (entry.phonetics) {
          const phoneticWithAudio = entry.phonetics.find(p => p.audio && p.audio.length > 0);
          if (phoneticWithAudio) {
            audio = phoneticWithAudio.audio;
          }
        }

        this.setState({
          data: {
            word: entry.word,
            pronunciation: audio,
            senses: senses,
            synonyms: [...new Set(synonyms)] // Unique synonyms
          }
        });
      })
      .catch(err => {
        this.setState({ data: { error: true } });
      });
  }

  componentDidMount() {
    this.getMeaning(this.props.match.params.word);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params !== prevProps.match.params) {
      this.getMeaning(this.props.match.params.word);
    }
  }

  handleClick = (word) => {
    document.getElementsByTagName("input")[0].focus();
    document.getElementsByTagName("input")[0].value = word;
  }

  render() {
    if (this.state.data.error) {
      const { word } = this.props.match.params;
      return (
        <div className='error'>
          <p style={{ textAlign: 'center' }}>No Results Found for <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => this.handleClick(word)}>"{word}"</span></p>
          <p>Tip: Try using the root form of words, like "run", instead of "ran"</p>
        </div>
      )
    }
    if (this.state.data.senses) {
      const { senses, synonyms, pronunciation } = this.state.data;
      return (
        <div className="result-container">
          <br />
          <h1 className='word'>{this.state.data.word} {pronunciation ? <Pronunciation url={pronunciation} /> : ''} </h1>
          <br />
          <Carousel senses={senses} />
          <br /><br /><br />
          {synonyms.length > 0 ? <Synonyms synonyms={synonyms} /> : ''}

        </div>
      )
    }
    return (<div><br /><br /><Search /><p className='loading'>Searching...</p></div>)
  }
}

export default Result;