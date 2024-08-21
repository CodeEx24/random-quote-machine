import React, { useEffect, useState } from 'react';
import { Twitter } from './assets/Twitter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons/faQuoteLeft';
import { SocialIcon } from './components/SocialIcon';
import { Tumblr } from './assets/Tumbler';
import SocialLinks from './components/SocialLinks';
import { socialLinks } from './const/socialLinks';

interface Quote {
  quote: string;
  author: string;
}

const App: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [color, setColor] = useState<string>('');
  const [animationKey, setAnimationKey] = useState<number>(0);

  const colors = [
    '#FF5733',
    '#FF6F61',
    '#F39C12',
    '#E74C3C',
    '#C0392B',
    '#9B59B6',
    '#8E44AD',
    '#3498DB',
    '#1ABC9C',
    '#2ECC71',
    '#F1C40F',
    '#E67E22',
    '#D35400',
    '#16A085',
    '#F39C12',
  ];

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('/quotes.json');
      if (!response.ok) throw new Error('Network response was not ok');

      const { quotes }: { quotes: Quote[] } = await response.json();
      const randomIndex = Math.floor(Math.random() * quotes.length);

      setQuote(quotes[randomIndex]);
      setColor(getRandomColor());
      setAnimationKey((prev) => prev + 1); // Trigger re-render for animation
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatForUrl = (text: string) => text.replace(/ /g, '+');

  const tumblrShareUrl = quote
    ? `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=${formatForUrl(
        quote.author
      )}&content=${formatForUrl(
        quote.quote
      )}&canonicalUrl=https://www.tumblr.com/buttons&shareSource=tumblr_share_button`
    : '#';

  const twitterShareUrl = quote?.quote
    ? `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="${formatForUrl(
        quote.quote
      )}" ${formatForUrl(quote.author)}`
    : '#';

  if (loading) return <div>Loading...</div>;

  if (!quote) return <div>No quote available</div>;

  return (
    <div
      id="wrapper"
      className="h-screen w-full flex flex-col items-center justify-center transition-colors duration-1000"
      style={{ backgroundColor: color }}
    >
      <div
        id="quote-box"
        className="bg-white w-11/12 md:w-[600px] p-12 rounded-md shadow-lg space-y-4"
      >
        <p
          id="text"
          className="text-lg md:text-2xl text-center flex relative w-full text-indent animate-fade duration-1000"
          style={{ color }}
          key={`${animationKey}quote`}
        >
          <FontAwesomeIcon icon={faQuoteLeft} className="mt-1" />
          <span className="ml-2">{quote.quote}</span>
        </p>

        <p
          id="author"
          className={`ml-2 animate-fade duration-1000 text-end`}
          style={{ color }}
          key={`${animationKey}author`}
        >
          - {quote.author}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <SocialIcon
              id="tweet-quote"
              url={twitterShareUrl}
              icon={<Twitter />}
              title="Tweet this quote!"
              color={color}
            />
            <SocialIcon
              id="tumblr-quote"
              url={tumblrShareUrl}
              icon={<Tumblr />}
              title="Share on Tumblr"
              color={color}
            />
          </div>
          <div className="flex gap-2">
            <button
              id="new-quote"
              className={`p-2 text-white rounded-sm text-sm bg-[${color}] animate-fade transition-colors duration-1000`}
              onClick={fetchRandomQuote}
              style={{ backgroundColor: color }}
            >
              New quote
            </button>
          </div>
        </div>
      </div>

      <SocialLinks links={socialLinks} />
    </div>
  );
};

export default App;
