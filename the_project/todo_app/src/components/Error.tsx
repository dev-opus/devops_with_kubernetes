import type { FC } from 'hono/jsx';
import { Layout } from './Layout.js';

export const ErrorPage: FC<{ errMsg: string }> = (props: {
  errMsg: string;
}) => {
  const { errMsg } = props;
  return (
    <Layout>
      <h1>An error has occurred</h1>
      <code
        style={{
          display: 'block',
          width: '50%',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
        }}
      >
        {errMsg}
      </code>
    </Layout>
  );
};

export const ErrorPageTitleRequired: FC = () => {
  return (
    <Layout>
      <h1>An error has occurred</h1>
      <p>
        <code>title</code> is required
      </p>
      <form action="/" method="get">
        <button type="submit">Go back home</button>
      </form>
    </Layout>
  );
};
