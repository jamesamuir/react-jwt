import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import {act} from "react-testing-library";
import {connect} from 'react-redux';
import {get} from "enzyme/src/configuration";
import {loadCourses} from "../../redux/actions/courseActions";

const Header = ({loadCourses, ...props}) => {
    const activeStyle = {color: '#F15B2A'};

    const [courses, setCourses] = useState([props.courses]);

    useEffect(() => {
        if (props.courses.length === 0){
            loadCourses().catch(error => {
                alert("error getting courses");
            })
        }else{
            setCourses(props.courses);
        }
    }, [props.courses]);

    return (
      <nav>
          <NavLink to={"/"} activeStyle={activeStyle} exact>Home</NavLink>
          {" | "}
          <NavLink to={"/courses"} activeStyle={activeStyle} >Courses</NavLink>
          {" | "}
          <NavLink to={"/authors"} activeStyle={activeStyle} >Authors</NavLink>
          {" | "}
          <NavLink to={"/about"} activeStyle={activeStyle} >About</NavLink>
          {" | "}
          <span className="badge badge-primary">{courses.length}</span>
      </nav>
    );
}

function mapStateToProps(state){
    return {
        courses: state.courses
    }
}

const mapDispatchToProps = {
    loadCourses: loadCourses
};



export default connect(mapStateToProps, mapDispatchToProps)(Header);