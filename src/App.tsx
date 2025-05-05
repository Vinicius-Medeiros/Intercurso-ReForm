import { closeSnackbar, MaterialDesignContent, SnackbarProvider } from "notistack"
import { Router } from "./Routes"
import { styled } from "@mui/system";
import { Provider } from 'react-redux';
import { store } from './store';
// import theme from "./theme";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-success': {
    color: theme.palette.text.primary,
    backgroundColor: '#6BC779',
  },
  '&.notistack-MuiContent-error': {
    color: theme.palette.text.primary,
    backgroundColor: '#ff8484',
  },
  '&.notistack-MuiContent-warning': {
    color: theme.palette.text.primary,
    backgroundColor: '#FFBE5C',
  },
  // '&.notistack-MuiContent-info': {
  //   color: theme.palette.text.primary,
  //   // backgroundColor: '#FFBE5C',
  // },
}))

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
          warning: StyledMaterialDesignContent,
        }}
        maxSnack={10}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        autoHideDuration={3000}
        action={(key) => (
          <button
            onClick={() => closeSnackbar(key)}
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              left: 0,
              top: 0,
              background: "transparent",
            }}
          />
        )}
        style={{ fontFamily: 'Roboto' }}
      >
        <Router />
      </SnackbarProvider>
    </Provider>
  )
}

export default App