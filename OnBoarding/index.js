/**
 * @format
 */

 import { initializeStore } from './src/store/store-initializer';
 import { NavigationInitializer } from './src/navigation/navigation.init';
  
 initializeStore();
 // Initialize Navigation As An Entry Point
 NavigationInitializer.init();
 
 // Suppress Moment Deprecations Warnings on Production
 try {
   moment.suppressDeprecationWarnings = true;
 } catch (e) {}