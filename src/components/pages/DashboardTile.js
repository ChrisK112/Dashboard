import React from "react";

function DashboardTile(props){
    return(
        <a className = "dashboardTile" href = {props.tilePage}>
            
                <h2 className = "dashboardTitle">{props.title}</h2>
                <div className = "tileContent" id = {props.title}>
                    {props.content}
                </div> 
            
                   
        </a>
    )
    
}

export default DashboardTile;

