import { AppRegistry } from 'react-native';
import App from './App';

// Register the app
AppRegistry.registerComponent('TurtleStudyApp', () => App);

// Run the app in the browser
AppRegistry.runApplication('TurtleStudyApp', {
  rootTag: document.getElementById('root'),
});
