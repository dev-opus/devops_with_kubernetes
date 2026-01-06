import { type FC } from 'hono/jsx';
import { Layout } from './Layout.js';
import { TodoSection } from './Todo.js';
import type { Todo } from '../utils/types.js';

export const Main: FC<{ image: string; todos: Todo[] }> = (props: {
  image: string;
  todos: Todo[];
}) => {
  return (
    <Layout>
      <h1>The Project App</h1>
      <img
        src={props.image}
        alt="Dynamic content"
        style={{ maxWidth: '20%' }}
      />
      <TodoSection todos={props.todos} />
      <h2>DevOps with Kubernetes 2026</h2>
    </Layout>
  );
};
