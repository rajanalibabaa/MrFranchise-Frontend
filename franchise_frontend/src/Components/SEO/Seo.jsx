import React from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({ 
  title,
  description,
  image,
  url,
  keywords,
  canonical,
  schema,
  og = {},
  twitter = {},
  additionalMeta = []
}) => {
  // Default values
  const defaultImage = "https://mrfranchise.in/images/default-social.jpg";
  const siteName = "Mr Franchise - India's #1 F&B Franchise Marketplace";
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{`${title} | ${siteName}`}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || "franchise, food franchise, business opportunities, cafe franchise, restaurant franchise, low investment franchise"} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical || url} />
      <link rel="icon" href="/favicon.ico" />
      <meta name="theme-color" content="#FF5722" />
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={og.title || title} />
      <meta property="og:description" content={og.description || description} />
      <meta property="og:image" content={og.image || image || defaultImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={og.type || "website"} />
      {og.imageWidth && <meta property="og:image:width" content={og.imageWidth} />}
      {og.imageHeight && <meta property="og:image:height" content={og.imageHeight} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitter.card || "summary_large_image"} />
      <meta name="twitter:site" content={twitter.site || "@MrFranchise"} />
      <meta name="twitter:creator" content={twitter.creator || "@MrFranchise"} />
      <meta name="twitter:title" content={twitter.title || title} />
      <meta name="twitter:description" content={twitter.description || description} />
      <meta name="twitter:image" content={twitter.image || image || defaultImage} />
      
      {/* Schema.org */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            ...schema
          })}
        </script>
      )}
      
      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => (
        <meta 
          key={index} 
          name={meta.name} 
          content={meta.content} 
          {...(meta.property && { property: meta.property })}
        />
      ))}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  url: PropTypes.string,
  keywords: PropTypes.string,
  canonical: PropTypes.string,
  schema: PropTypes.object,
  og: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    imageWidth: PropTypes.string,
    imageHeight: PropTypes.string
  }),
  twitter: PropTypes.shape({
    card: PropTypes.string,
    site: PropTypes.string,
    creator: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string
  }),
  additionalMeta: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      content: PropTypes.string,
      property: PropTypes.string
    })
  )
};

SEO.defaultProps = {
  og: {},
  twitter: {},
  additionalMeta: []
};

export default SEO;