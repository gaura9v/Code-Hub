import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function BugHomepage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [problems, setProblems] = useState([]);

    const [filters, setFilters] = useState({
        difficulty: 'all',
        tag: 'all'
    });

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get('/bug/problems');
                setProblems(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProblems();
    }, []);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch =
            filters.difficulty === 'all' || problem.difficulty === filters.difficulty;

        const tagMatch =
            filters.tag === 'all' || problem.tags === filters.tag;

        return difficultyMatch && tagMatch;
    });

    return (
        <div className="min-h-screen bg-base-200">

            <nav className="navbar bg-base-100 shadow-lg px-4">
                <div className="flex-1">
                    <NavLink to="/" className="btn btn-ghost text-xl">CodeHub</NavLink>
                    <NavLink to="/buginjection" className="btn btn-ghost text-xl">BugInjection</NavLink>
                </div>

                <div className="flex-none gap-4">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost">
                            {user?.firstName}
                        </div>
                        <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><button onClick={handleLogout}>Logout</button></li>
                            {user?.role === 'admin' && <li><NavLink to="/admin">Admin</NavLink></li>}
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto p-4">

                <h2 className="text-2xl font-bold mb-6">🐞 Bug Injection Problems</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                    <select
                        className="select select-bordered"
                        value={filters.difficulty}
                        onChange={(e) =>
                            setFilters({ ...filters, difficulty: e.target.value })
                        }
                    >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <select
                        className="select select-bordered"
                        value={filters.tag}
                        onChange={(e) =>
                            setFilters({ ...filters, tag: e.target.value })
                        }
                    >
                        <option value="all">All Tags</option>
                        <option value="array">Array</option>
                        <option value="linkedList">Linked List</option>
                        <option value="graph">Graph</option>
                        <option value="dp">DP</option>
                    </select>
                </div>

                <div className="grid gap-4">

                    {filteredProblems.length === 0 ? (
                        <div className="text-center mt-20 text-gray-500 text-lg">
                            🐞 No Bug Injection problems created yet
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredProblems.map(problem => (
                                <div key={problem._id} className="card bg-base-100 shadow-xl">
                                    <div className="card-body">

                                        <NavLink
                                            to={`/bug/${problem._id}`}
                                            className="card-title hover:text-primary"
                                        >
                                            {problem.title}
                                        </NavLink>

                                        <div className="flex gap-2">
                                            <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </div>
                                            <div className="badge badge-info">
                                                {problem.tags}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'badge-success';
        case 'medium': return 'badge-warning';
        case 'hard': return 'badge-error';
        default: return 'badge-neutral';
    }
};

export default BugHomepage;
