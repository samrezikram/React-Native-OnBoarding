/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { Dispatch, bindActionCreators } from 'redux';
 import { connect } from 'react-redux';
 import { Image, Animated, StyleSheet, View, TouchableOpacity, I18nManager, FlatList, NativeModules, Platform } from 'react-native';

 import { Layout, Text, withStyles, ThemeType, Toggle } from 'react-native-ui-kitten';
 import { bind as autobind, debounce } from 'lodash-decorators';

 import { IGlobalState } from '@models/app/global-state.model';
 import { ITransaction } from '@models/app/transaction.model';

 import { ThemeKind, ThemeName } from '@enums/theme-name.enum';

 
 import { IAppScreenProps } from '@interfaces/app-screen-props.interface';
 import { IAppScreen } from '@interfaces/app-screen.interface';
 import { Navigator } from '@navigation/navigator';
 
 import { loadTransactionItemsAsync } from '@actions/app.actions';
 import { setThemeAsync } from '@actions/theme.actions';

 import { WalletCard } from '@components/wallet-card.component';
 import { TransactionCard } from '@components/transaction-card.component';

 // Debounce Decorator Function Options
 const debOptions: object = {leading: true, trailing: false};

 interface IMapStateToProps {
   transactionItems: ITransaction[];
   totalTransactionCount: number;
   isLoadingTransactionItems: boolean;
   transactionsLoadingError: string;
   themeKind?: ThemeKind
 }

 interface IMapDispatchToProps {
  loadTransactionItemsAsync: typeof loadTransactionItemsAsync;
  setThemeAsync: typeof setThemeAsync;
 }

 export interface IMainScreenProps extends IAppScreenProps, IMapStateToProps, IMapDispatchToProps {}

 export interface IMainScreenState {}


 class MainScreenComponent extends React.Component<IMainScreenProps, IMainScreenState> implements IAppScreen {
   
   private readonly testIdPrefix: string = 'main_screen';

   public state: IMainScreenState = {};
   // ---------------------

   componentDidMount(): void {
    this.props.loadTransactionItemsAsync();
   }
   // ---------------------

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  @autobind
  @debounce(500, debOptions)
  private onActiveThemeCheckedChange(isChecked: boolean): void {
    if (this.props.setThemeAsync) {
      if(isChecked) {
        this.props.setThemeAsync(ThemeName.Blue);
        // this.onPressedInAnimation()
      } else {
        this.props.setThemeAsync(ThemeName.Light);
        // this.onPressedInAnimation()

      }    
    }
  }

  
  private renderToggleTheme() {
    return (
      <View style={styles.themes}>
        <Text style={styles.appearance}>Appearance</Text>
        <Toggle style={styles.toggle} checked={this.props.themeKind == ThemeKind.Dark ? true : false} 
        onChange={this.onActiveThemeCheckedChange}/>
      </View>   
    );
  }


  private onTransactionCardPressed(transaction: ITransaction): () => void {
    return () => {
     if (transaction && transaction?.paymentData) {
     }
    };
  }

  @autobind
  private renderTransactionsHeaderComponent(): React.ReactElement {
    return (
      <Text category="h6" style={styles.transactionListSectionHeader}>
        {'Transactions'}
      </Text>
    );
  }
  // ---------------------

  @autobind
  private _renderItem({ item, index }: {item: ITransaction | any, index: number}): React.ReactElement {
    return (
      <View style={styles.transactionItemContainer}>
        <TransactionCard
          transaction={item}
          onPress={this.onTransactionCardPressed(item)}/>
      </View>
    );
  }
  // ---------------------


  public render(): React.ReactElement {
    return (
      <Layout level="2" style={styles.container}>
        {this.renderToggleTheme()}
        {<WalletCard/>}
        <FlatList
          ListHeaderComponent={this.renderTransactionsHeaderComponent}
          style={{flex: 1}}
                data={this.props.transactionItems}
                renderItem={this._renderItem}
                keyExtractor={(_item, index) => `${index}`}
                ItemSeparatorComponent={this.renderSeparator}
        /> 
      </Layout>
    );
  }
 }

 // Styles -----------------------------------------------------------------------------------
 const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
     flex: 1,
     paddingTop: 44 + 2
  }, 
  themes: {
     flexDirection: 'row',
     justifyContent: 'flex-end',
     alignItems: 'center',
     paddingHorizontal: 16,
  },
  appearance: {
    fontSize: 15,
    paddingVertical: 5,
    paddingRight: 8,
    color: '#2f5fb3'
  },
  toggle: {
  },
  sendRoot: {
    marginHorizontal: 120,
    paddingVertical: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#ccddf9',
  },
  icon: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    backgroundColor: 'transparent',
    color: '#2f5fb3'
  },
  separator: {
    backgroundColor: '#d2d2d2',
    height: 0.5,
    marginBottom: 4,
    marginHorizontal: 50
  },
  transactionListSectionHeader: {
    paddingTop: 16,
    paddingHorizontal: 16
  },
  transactionItemContainer: {
    paddingTop: 10,
    marginBottom: 16
  },
  
 });
 // ------------------------------------------------------------------------------------------


 // Connecting To Redux ----------------------------------------------------------------------
 function mapStateToProps(state: IGlobalState): any {
   return {
     transactionItems: state.app.transactionItems,
     totalTransactionCount: state.app.totalTransactionCount,
     isLoadingTransactionItems: state.app.isLoadingTransactionItems,
     transactionLoadingError: state.app.transactionLoadingError,
     themeKind: state.theme.themeKind
   };
 }
 // -----------

 function mapDispatchToProps(dispatch: Dispatch<any>): any {
   return {
     ...bindActionCreators({
      loadTransactionItemsAsync,
      setThemeAsync,
     }, dispatch),
   };
 }
 // ----------------------------------

 const MainScreenConnected = connect(mapStateToProps, mapDispatchToProps)(MainScreenComponent);

 export const MainScreen = withStyles(MainScreenConnected, (theme: ThemeType) => ({
   selectedTabHighlighter: {
     backgroundColor: theme['color-primary-500']
   },
   layoutLevel2: {
     backgroundColor: theme['background-basic-color-2'],
   },
   layoutLevel3: {
     backgroundColor: theme['background-basic-color-3'],
   }
 }));