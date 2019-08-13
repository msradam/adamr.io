import React, { Component } from 'react';
import { Link } from 'gatsby';

export default class Contact extends Component {
  render() {
    return (
      <>
        <h1>Contact Me!</h1>
        <ul>
          <li>
            <strong>Email</strong>:{' '}
            <a href="mailto:mrahmanadam[AT]gmail[DOT]com">
              mrahmanadam@gmail.com
            </a>
          </li>
          <li>
            <strong>GitHub</strong>:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/msradam"
            >
              msradam
            </a>
          </li>
          <li>
            <strong>LinkedIn</strong>:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://linkedin.com/in/adamsrahman"
            >
              adamsrahman
            </a>
          </li>
        </ul>
      </>
    );
  }
}
