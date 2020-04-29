import * as actionTypes from "./actionTypes";
import * as authorApi from "../../api/authorApi";
import {apiCallError, beginApiCall} from "./apiStatusAction";


export function loadAuthorsSuccess(authors){
    return {type: actionTypes.LOAD_AUTHORS_SUCCESS, authors: authors};
}

export function createAuthorSuccess(author){
    return {type: actionTypes.CREATE_AUTHOR_SUCCESS, author: author};
}
export function updateAuthorSuccess(author){
    return {type: actionTypes.UPDATE_AUTHOR_SUCCESS, author: author};
}

export function deleteAuthorOptimistic(author){
    return {type: actionTypes.DELETE_AUTHOR_OPTIMISTIC, author: author}
}

export function loadAuthors(){
    return function(dispatch){

        // invoke loader
        dispatch(beginApiCall());

        return authorApi.getAuthors().then(authors => {
            dispatch(loadAuthorsSuccess(authors));
        }).catch(error => {
            dispatch(apiCallError());
            throw error;
        })
    }
}

export function saveAuthor(author){
    return function(dispatch){
        //invoke loader
        dispatch(beginApiCall());
        return authorApi.saveAuthor(author).then(savedAuthor => {
            savedAuthor.id?
                dispatch(updateAuthorSuccess(savedAuthor)):
                dispatch(createAuthorSuccess(savedAuthor))

        }).catch(error => {
            dispatch(apiCallError());
            throw error;
        })
    }
}

export function deleteAuthor(author){
    return function(dispatch){
        dispatch(deleteAuthorOptimistic(author));
        return authorApi.deleteAuthor(author.id);
    }
}