import React from 'react';
import {Link} from "react-router-dom";

function AuthorsList({authors, onDeleteClick}) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>Name</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {authors.map(author => {
                return (
                    <tr key={author.id}>

                        <td>
                            <Link to={"/author/" + author.id}>{author.name}</Link>
                        </td>
                        <td>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => onDeleteClick(author)}
                            >X</button>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default AuthorsList;