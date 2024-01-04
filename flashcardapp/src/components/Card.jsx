import './Card.css';

export function Card(props) {
    return (
        <div class="card" onClick={ props.onClick }>
            { props.children }
        </div>
    );
}

