import React from 'react';
import { Link } from 'react-router-dom';

interface Sample {
  title: string;
  category: string;
  path: string;
  description: string;
  noPolyfill?: boolean;
}

interface SampleListProps {
  samples: Sample[];
}

const SampleList: React.FC<SampleListProps> = ({ samples }) => {
  const categories = Array.from(new Set(samples.map(sample => sample.category)));

  return (
    <div>
      {categories.map(category => (
        <div key={category}>
          <h2>{category}</h2>
          {samples
            .filter(sample => sample.category === category)
            .map((sample, index) => (
              <article key={sample.path} data-index={index + 1}>
                <h3>{sample.title}</h3>
                <p>{sample.description}</p>
                <div className="links">
                  <Link to={sample.path}>Try it</Link>
                  <a href={`https://github.com/immersive-web/webxr-samples/blob/main/${sample.path}`} className="github-link">
                    View Source
                  </a>
                </div>
              </article>
            ))}
        </div>
      ))}
    </div>
  );
};

export default SampleList; 