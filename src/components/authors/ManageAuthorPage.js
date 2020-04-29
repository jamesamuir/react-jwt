import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {loadAuthors, saveAuthor} from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import AuthorForm from "./AuthorForm";
import { newAuthor } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import {toast} from "react-toastify";
import CourseForm from "../courses/CourseForm";



function ManageAuthorPage({loadAuthors, saveAuthor, authors, history, ...props}) {

    const [author, setAuthor] = useState({...props.author});
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
       if (authors.length === 0){
           loadAuthors().catch(error => {
              toast.error("There was a problem loading the authors");
           });
       }else{
           setAuthor({...props.author});
       }
    }, [props.author]);

    function handleChange(event){
        const {name, value} = event.target;
        setAuthor( prevAuthor => ({
            ...author,
            [name]: value
        }));
    }

    function formIsValid(author){
        const {name} = author;
        const errors = {};

        if (!name) errors.name = "Name is required";

        setErrors(errors);

        return Object.keys(errors).length === 0;
    }

    function handleSave(event){
        event.preventDefault();

        if (!formIsValid(author)) return;

        setSaving(true);

        //validate
        saveAuthor(author).then(() => {
            toast.success("Author has been saved.");
            setSaving(false);
            history.push("/authors");
        }).catch(error => {
            setSaving(false);
            setErrors({
                onSave: error.message
            });
        });
    }

    return (
        authors.length === 0 ? <Spinner/> : (
            <AuthorForm author={author} errors={errors} onChange={handleChange} onSave={handleSave} saving={saving}/>
        )
    );
}

export function getAuthorById(authors, id){
    return authors.find(author => author.id === parseInt(id, 10));
}

function mapStateToProps(state, ownProps){

    const id = ownProps.match.params.id;
    const author = id && state.authors.length > 0? getAuthorById(state.authors, id) : newAuthor;

    return {
        author: author,
        authors: state.authors,
        loading: state.apiCallsInProgress.length > 0
    }
}
const mapDispatchToProps = {
    loadAuthors: loadAuthors,
    saveAuthor: saveAuthor
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAuthorPage);