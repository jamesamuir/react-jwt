import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import {loadCourses, saveCourse} from '../../redux/actions/courseActions';
import {loadAuthors} from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import {toast} from "react-toastify";


export function ManageCoursePage({courses, authors, loadAuthors, loadCourses, saveCourse, history, redirectTo404, ...props}){


    const [course, setCourse] = useState({ ...props.course });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(props.loading);
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        if (courses.length === 0 ){
            loadCourses().catch(error => {
                alert("Loading courses failed: " + error);
            });
        } else {
            setCourse({...props.course});
        }

        if (authors.length === 0){
            loadAuthors().catch(error => {
                alert("Loading authors failed: " + error);
            });
        }

    }, [props.course]);

    useEffect(() => {
        setLoading(props.loading)
    }, [props.loading]);

    function handleChange(event){
        const {name, value} = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10): value
        }));
    }

    function formIsValid(){
        const {title, authorId, category} = course;
        const errors = {};

        if (!title) errors.title = "Title is required";
        if (!authorId) errors.author = "Author is required";
        if (!category) errors.category = "Category is required";

        setErrors(errors);

        return Object.keys(errors).length === 0;
    }

    function handleSave(event){
        event.preventDefault();

        if (!formIsValid()) return;

        setSaving(true);
        saveCourse(course).then(() => {
            toast.success("Course has been saved.");

            history.push("/courses");
        }).catch(error => {
            setSaving(false);
            setErrors({
                onSave: error.message
            });
        })
    }


    return (

        <>
            {props.redirectTo404 && <Redirect to="/404" />}
            {loading === true ? <Spinner/> : (
                <CourseForm authors={authors} course={course} errors={errors} onChange={handleChange}
                            onSave={handleSave} saving={saving}/>
            )
            }
        </>


    );
}

export function getCourseBySlug(courses, slug){
    return courses.find(course => course.slug === slug);
}

function mapStateToProps(state, ownProps){
    const slug = ownProps.match.params.slug;
    const course = slug && state.courses.length > 0? getCourseBySlug(state.courses, slug) : newCourse;

    const redirectTo404 = slug && course === undefined;

    return {
        course: course,
        courses: state.courses,
        authors: state.authors,
        loading: state.apiCallsInProgress > 0,
        redirectTo404: redirectTo404
    };
}

const mapDispatchToProps = {
    loadCourses: loadCourses,
    loadAuthors: loadAuthors,
    saveCourse: saveCourse
}

ManageCoursePage.propTypes = {
    course: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    loadCourses: PropTypes.func.isRequired,
    loadAuthors: PropTypes.func.isRequired,
    saveCourse: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
