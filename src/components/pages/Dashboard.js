import React, { Component } from 'react';


function Dashboard(props){
        return(
            <div className = "dashboardSpace">
                {props.children}
            </div>
        )
}

export default Dashboard;