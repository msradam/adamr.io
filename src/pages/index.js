import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql, Link } from 'gatsby';
import GitHubButton from 'react-github-btn';
import Layout from '../layout';
import PostListing from '../components/PostListing';
import ProjectListing from '../components/ProjectListing';
import SimpleListing from '../components/SimpleListing';
import SEO from '../components/SEO';
import config from '../../data/SiteConfig';
import projects from '../../data/projects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faCheckSquare,
  faCoffee,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

library.add(fab, faCheckSquare, faCoffee);
export default class Index extends Component {
  render() {
    const { data } = this.props;

    const latestPostEdges = data.latest.edges;
    const popularPostEdges = data.popular.edges;

    return (
      <Layout>
        <Helmet title={`${config.siteTitle} – Data & Backend Engineer`} />
        <SEO />
        <div className="container">
          <div className="lead">
            <h1>{`Hi! I'm Adam.`}</h1>
            <p>
              {`I'm a software engineer committed to creating social impact. `}
            </p>
            <p>
              {`Check out my projects below and stay in touch!`}
            </p>
            <div className="social-buttons">
              <a
                href="https://github.com/msradam"
                target="_blank"
                style={{ color: 'inherit' }}
              >
                <label className="social-label">
                  <FontAwesomeIcon
                    size="lg"
                    color="6e5494"
                    icon={['fab', 'github']}
                  />{' '}
                  Github
                </label>
              </a>
              <a
                href="https://linkedin.com/in/adamsrahman"
                target="_blank"
                style={{ color: 'inherit' }}
              >
                <label className="social-label">
                  <FontAwesomeIcon size="lg" icon={['fab', 'linkedin']} />{' '}
                  LinkedIn
                </label>
              </a>
              <a
                href="mailto:mrahmanadam@gmail.com"
                target="_blank"
                style={{ color: 'inherit' }}
              >
                <label className="social-label">
                  <FontAwesomeIcon size="lg" icon={faEnvelope} /> Email
                </label>
              </a>

              {/* <GitHubButton
                  href="https://github.com/msradam"
                  data-size="large"
                  data-show-count="false"
                  aria-label="Follow @msradam on GitHub"
                >
                  Follow
                </GitHubButton> */}
            </div>
          </div>
        </div>
        
        <div className="container front-page">
          <section className="cards-main">
            <h2>Projects</h2>
            <ProjectListing projects={projects} />
          </section>

          {/* <section className="section">
            <h2>Latest Articles</h2>
            <PostListing simple postEdges={latestPostEdges} />
          </section> */}
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    latest: allMarkdownRemark(
      limit: 6
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
    popular: allMarkdownRemark(
      limit: 7
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { categories: { eq: "Popular" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
  }
`;
