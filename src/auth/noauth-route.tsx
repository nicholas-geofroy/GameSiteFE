import { ComponentClass } from "react";
import {
  ChangeEvent,
  Component,
  FC,
  ReactElement,
  SyntheticEvent,
  useState,
} from "react";
import { Route } from "react-router-dom";
import Loading from "../components/loading";

interface UserComponentProps {
  userName: string;
  userId: string;
  [others: string]: any;
}

interface UsernameProps {
  username: string;
  [x: string]: any;
}

export const usernameRequired = (
  WrappedComponent: typeof Component<UserComponentProps>
) => {
  const GetUserId: (p: UsernameProps) => ReactElement = ({
    username,
    ...props
  }) => {
    const loading = false;
    const error = null;
    const data = {
      id: username,
    };

    if (loading) {
      return <Loading></Loading>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <WrappedComponent
        userName={username}
        userId={data["id"]}
        {...props}
      ></WrappedComponent>
    );
  };
  return GetDesiredUsername(GetUserId);
};

function GetDesiredUsername(WrappedComponent: FC<UsernameProps>) {
  const GetUsernameComponent = (props: Record<string, any>) => {
    const [submit, setSubmit] = useState(false);
    const [username, setUsername] = useState("");

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    };

    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      setSubmit(true);
      return false;
    };

    return (
      <>
        {submit || (
          <>
            <input
              className="playerInput input"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onSubmit={onSubmit}
              placeholder={"What's Your Name?"}
            />
            <button className="button primary" onClick={onSubmit}>
              Submit
            </button>
          </>
        )}
        {submit && <WrappedComponent username={username} {...props} />}
      </>
    );
  };
  return GetUsernameComponent;
}

interface NoAuthRouteParams {
  component: ComponentClass<UserComponentProps>;
  [args: string]: any;
}
const NoAuthRoute: (p: NoAuthRouteParams) => ReactElement = ({
  component,
  ...args
}) => <Route component={usernameRequired(component)} {...args} />;

export default NoAuthRoute;
