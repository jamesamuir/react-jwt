import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import AuthorsList from "./AuthorsList";
import Spinner from "../common/Spinner";
import {toast} from "react-toastify";
import {loadAuthors, deleteAuthor} from "../../redux/actions/authorActions";
import {loadCourses} from "../../redux/actions/courseActions";

function AuthorsPage({loadAuthors, deleteAuthor, loadCourses, ...props}) {
    const [authors, setAuthors] = useState([...props.authors]);
    const [courses, setCourses] = useState([...props.courses]);
    const [loading, setLoading] = useState(props.loading);
    const [redirectToAddAuthorPage, setRedirectToAddAuthorPage] = useState(false);

    useEffect(() => {
        if (props.authors.length === 0 ){
            loadAuthors().catch(error => {
                alert("Loading authors failed: " + error);
            });
        } else {
            setAuthors([...props.authors]);
        }

        if (props.courses.length === 0){
            loadCourses().catch(error => {
                alert("Loading courses failed: " + error);
            })
        }else{
            setCourses([...props.courses]);
        }

    }, [props.authors]);

    useEffect(() => {
        setLoading(props.loading)
    }, [props.loading]);

    function authorCanBeDeleted(author){
        const existingCourses = courses.filter(course => course.authorId === author.id);
        return existingCourses.length === 0;
    }

    function handleDeleteAuthor(author){

        if (!authorCanBeDeleted(author)){
            toast.warn("Author cannot be deleted when associated with existing courses", {autoClose: false});
            return;
        }

        toast.success("Author was deleted");
        deleteAuthor(author).catch(error => {
            toast.error("Delete failed. " + error.message, {autoClose: false});
        });
    }

    return (
        <>
            {redirectToAddAuthorPage && <Redirect to={"/author"}/>}
            <h2>Authors</h2>
            {loading === true ? <Spinner/> : (
                <>
                    <button
                        style={{ marginBottom: 20 }}
                        className="btn btn-primary add-course"
                        onClick={() => setRedirectToAddAuthorPage(true )}
                    >
                        Add Author
                    </button>
                    <AuthorsList authors={authors} onDeleteClick={handleDeleteAuthor} />
                </>
            )}

        </>
    );
}

function mapStateToProps(state){
    return {
        authors: state.authors,
        courses: state.courses,
        loading: state.apiCallsInProgress > 0

    }
}
const mapDispatchToProps = {
    loadAuthors: loadAuthors,
    deleteAuthor: deleteAuthor,
    loadCourses: loadCourses
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
