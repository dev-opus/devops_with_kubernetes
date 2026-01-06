import type { FC } from 'hono/jsx';
import type { Todo } from '../utils/types.js';

export const TodoSection: FC<{ todos: Todo[] }> = (props: {
  todos: Todo[];
}) => {
  return (
    <>
      <div style={{ marginTop: '10px' }}>
        <form action="/todos" method="post">
          <input
            type="text"
            name="todo"
            id="todo"
            minlength={2}
            maxlength={140}
            style={{
              display: 'inline-block',
              padding: '2px',
              lineHeight: '1.2rem',
            }}
          />
          <button
            type="submit"
            style={{
              display: 'inline-block',
              padding: '4px',
              marginLeft: '10px',
              cursor: 'pointer',
            }}
          >
            Create todo
          </button>
        </form>
      </div>

      <div>
        <ul>
          {props.todos.map((todo) => {
            return (
              <b>
                <li key={todo.id}>{todo.title}</li>
              </b>
            );
          })}
        </ul>
      </div>
    </>
  );
};
