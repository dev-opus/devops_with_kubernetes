import { type FC } from 'hono/jsx';

export const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <title>Todo App</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
};
