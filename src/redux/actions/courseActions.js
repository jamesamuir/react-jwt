import * as actionTypes from "./actionTypes";
import * as courseApi from "../../api/courseApi";
import {apiCallError, beginApiCall} from "./apiStatusAction";
export function createCourse(course){
    return { type: actionTypes.CREATE_COURSE, course: course};
}

export function loadCoursesSuccess(courses){
    return {type: actionTypes.LOAD_COURSES_SUCCESS, courses: courses};
}

export function createCourseSuccess(course){
    return {type: actionTypes.CREATE_COURSE_SUCCESS, course: course};
}

export function updateCourseSuccess(course){
    return {type: actionTypes.UPDATE_COURSE_SUCCESS, course: course};
}
export function deleteCourseOptimistic(course){
    return {type: actionTypes.DELETE_COURSE_OPTIMISTIC, course: course};
}

export function loadCourses(){
    return function(dispatch){

        // invoke loader
        dispatch(beginApiCall());

        return courseApi.getCourses().then(courses => {
            dispatch(loadCoursesSuccess(courses));
        }).catch(error => {
            dispatch(apiCallError());
            throw error;
        })
    }
}

export function saveCourse(course){
    return function(dispatch){

        // invoke loader
        dispatch(beginApiCall());

        return courseApi.saveCourse(course).then(savedCourse => {
            course.id
            ? dispatch(updateCourseSuccess(savedCourse))
            : dispatch(createCourseSuccess(savedCourse))
        }).catch(error => {
            dispatch(apiCallError());
            throw error;
        })
    }
}

export function deleteCourse(course){
    return function(dispatch){
        dispatch(deleteCourseOptimistic(course));
        return courseApi.deleteCourse(course.id);
    }
}