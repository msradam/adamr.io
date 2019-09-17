import React, { Component, Fragment } from 'react';
import GitHubButton from 'react-github-btn';

export default class ProjectListing extends Component {
  render() {
    const { projects } = this.props;

    return(
      
      <ul className="cards">
        {projects.map (project =>
             <div className="cards_item">
             <div className="card">
               <div className="card-img"><img src={project.img}></img></div>
               <div className="card_content">
                 <h2 className="card_title">{project.icon} {project.title}</h2>
                 <p className="card_text">{project.description}</p>
                 <div className="row">
                 <a href={project.path} className="card_btn" target="_blank">Site</a>
                 <a href={project.source} className="card_btn" target="_blank">Source</a>
                 </div>
                
               </div>
           </div>
           </div>   
          
          
          
          
          
          )}
      </ul> 
    )
  }
  };
