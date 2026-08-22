<?xml version="1.0" encoding="utf-8"?>
<!--

Styles /feed.xml as a human-readable page using my own stylesheet
instead of generic styling, so a visitor who opens the feed URL 
directly sees something that looks ~~good~~ like the rest of the site.

Structure ~~stolen~~ adapted from the "Pretty Atom Feed" stylesheet in the eleventy-base-blog:
https://github.com/11ty/eleventy-base-blog/blob/main/content/feed/pretty-atom-feed.xsl
which itself credits "Pretty RSS Feed": https://github.com/genmon/aboutfeeds/issues/26

-->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'"/>
        <title><xsl:value-of select="atom:feed/atom:title"/> Feed</title>
        <link rel="stylesheet" href="/css/style.css"/>
        <link rel="stylesheet" href="/css/nunito.css"/>
        <link rel="stylesheet" href="/feed/feed-preview.css"/>
        <link rel="shortcut icon" href="/img/favicon.ico"/>
        <link rel="icon" href="/img/pretz.png"/>
      </head>
      <body>
        <div class="feed-page">
          <div class="post feed-banner">
            <p>
              <strong>This is a web feed,</strong> also known as an Atom feed.
              <br/>
              Subscribe by copying the URL from the address bar into a newsreader.
            </p>
            <p>Visit <a href="https://aboutfeeds.com">About Feeds</a> to get started, it's free.</p>
          </div>
          <header class="post">
            <h1>
              <svg class="feed-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="1.2em" height="1.2em" aria-hidden="true">
                <circle cx="4" cy="16" r="2" fill="currentColor"/>
                <path d="M2 9a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                <path d="M2 3a15 15 0 0 1 15 15" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <xsl:value-of select="atom:feed/atom:title"/>
            </h1>
            <p><xsl:value-of select="atom:feed/atom:subtitle"/></p>
            <p>This is a preview of the feed's contents, titles only. The real feed includes full content.</p>
            <a class="btn">
              <xsl:attribute name="href">
                <xsl:value-of select="/atom:feed/atom:link[not(@rel)]/@href"/>
              </xsl:attribute>
              Visit Website &#x2192;
            </a>
          </header>
          <h2>Recent Items</h2>
          <xsl:choose>
            <xsl:when test="atom:feed/atom:entry">
              <xsl:apply-templates select="atom:feed/atom:entry"/>
            </xsl:when>
            <xsl:otherwise>
              <p class="subpost">Nothing's been posted yet, check back later.</p>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>
  <xsl:template match="atom:feed/atom:entry">
    <article class="subpost">
      <h3 class="entry-title">
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="atom:link/@href"/>
          </xsl:attribute>
          <xsl:value-of select="atom:title"/>
        </a>
      </h3>
      <small>Published <xsl:value-of select="atom:updated"/></small>
    </article>
  </xsl:template>
</xsl:stylesheet>
