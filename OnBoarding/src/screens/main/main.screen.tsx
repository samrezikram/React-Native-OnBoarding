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
 import {Dimensions, Animated, SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';

 import { Layout, Text, withStyles, ThemeType, Toggle, StyleType } from 'react-native-ui-kitten';
 import { bind as autobind, debounce } from 'lodash-decorators';

 import { IGlobalState, IThemeState } from '@models/app/global-state.model';
 import { IWallet } from '@models/app/wallet.model';

 import { ThemeKind, ThemeName } from '@enums/theme-name.enum';
 
 import { IAppScreenProps } from '@interfaces/app-screen-props.interface';
 import { IAppScreen } from '@interfaces/app-screen.interface';
 
 import { loadWalletItemsAsync } from '@actions/app.actions';
 import { setThemeAsync } from '@actions/theme.actions';

 import { WalletCard } from '@components/wallet-card.component';
 import { HapticFeedbackService } from '@services/haptic-feedback/haptic-feedback.service';
 
 import _ from 'lodash';

 // Debounce Decorator Function Options
 const debOptions: object = {leading: true, trailing: false};
 interface IMapStateToProps {
   walletItems: IWallet[];
   totalWalletCount: number;
   isLoadingWalletItems: boolean;
   walletLoadingError: string;
   themeKind?: ThemeKind,
   theme: IThemeState;
 }
 interface IMapDispatchToProps {
  loadWalletItemsAsync: typeof loadWalletItemsAsync;
  setThemeAsync: typeof setThemeAsync;
 }
 export interface IMainScreenState {
  index: number,
 }
 export interface IMainScreenProps extends IAppScreenProps, IMapStateToProps, IMapDispatchToProps {
  themedStyle?: StyleType;
 }

 const itemWidth = Math.round(Dimensions.get('window').width);
 const separatorWidth = 20;
 const totalItemWidth = itemWidth + separatorWidth;
 class MainScreenComponent extends React.Component<IMainScreenProps, IMainScreenState> implements IAppScreen {
   
   public state: IMainScreenState = {
    index: 1
   };
   // ---------------------

   private readonly testIdPrefix: string = 'main_screen';
  
   private slider: React.RefObject<any> = React.createRef();

   componentDidMount(): void {
    this.props.loadWalletItemsAsync();
    // this.animateBackButton(false);

   }
   // ---------------------

   constructor(props) {
    super(props);
  }

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  @autobind
  @debounce(500, debOptions)
  private onActiveThemeCheckedChange(isChecked: boolean): void {
    if (this.props.setThemeAsync) {
      if(isChecked) {
        this.props.setThemeAsync(ThemeName.Blue);
      } else {
        this.props.setThemeAsync(ThemeName.Light);
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

  private onTransactionCardPressed(transaction: IWallet): () => void {
    return () => {
     if (transaction && transaction?.description) {
     }
    };
  }

  @autobind
  private _renderItem({ item, index }: {item: IWallet | any, index: number}): React.ReactElement {
    return (
      <View style={styles.transactionItemContainer}>
        <WalletCard
          wallet={item}
          active={index === this.state.index}
          index={index === this.state.index}
          onPress={this.onTransactionCardPressed(item)}/>
      </View>
    );
  }
  // ---------------------

  viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  private scaleBackButton: Animated.Value = new Animated.Value(1);
  private scaleNextButton: Animated.Value = new Animated.Value(1);



  private animateBackButton(show: boolean): void {
    Animated.timing(this.scaleBackButton, {
      toValue: show ? 1.0 : 0.8,
      duration: 50,
      useNativeDriver: true
    }).start();
  }
  // ---------------------

  private animateNextButton(show: boolean): void {
    Animated.timing(this.scaleNextButton, {
      toValue: show ? 1.0 : 0.8,
      duration: 50,
      useNativeDriver: true
    }).start();
  }
  // ---------------------

  @autobind
  private previousWallet(): void {
    HapticFeedbackService.impactHeavy();
    if(this.state.index <= this.props.totalWalletCount - 1) {
      if (this.state.index > 0) {
        if (this.slider && this.slider.current) {
          this.slider.current.scrollToIndex({
            index: this.state.index - 1
          });
        }
      }
    }
  }
  // ---------------------

  private onViewableItemsChanged = ({viewableItems, changed}) => {
    let currentIndex = viewableItems[0].index;

    if (viewableItems.length > 0) {
      this.setState({index: currentIndex});
      if(currentIndex === 0) {
        this.animateBackButton(false);
      }
      else if(currentIndex === this.props.walletItems.length - 1) {
        this.animateNextButton(false);
      } else {
        this.animateNextButton(true);
        this.animateBackButton(true);
      }
    }
  };
  // ---------------------

  @autobind
  private nextWallet(): void {
    if(this.state.index < this.props.totalWalletCount - 1) {
      HapticFeedbackService.impactHeavy();
      if (this.state.index < (this.props.totalWalletCount)) {
        if (this.slider && this.slider.current) {
          this.slider.current.scrollToIndex({
            index: this.state.index + 1
          });
        }
      }
    }
  }
  // ---------------------


  public render(): React.ReactElement {
    return (
      <Layout level="2" style={styles.container}>
        {this.renderToggleTheme()}

        <FlatList
          ref={this.slider}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          data={this.props.walletItems}
          renderItem={this._renderItem}
          ItemSeparatorComponent={() => (
            <View style={{width: 0}} />
          )}
          keyExtractor={(item, index) => item.toString() + index}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
        />

        <View style={styles.controlsViewContainer}>
          <SafeAreaView>
            <View style={styles.controlButtonsContainer}>
                            
                {/* Back Button */}
                <Animated.View style={{transform: [{scale: this.scaleBackButton}], opacity: this.scaleBackButton}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.previousWallet}
                    disabled={this.state.index === 0 ? true : false}
                    style={[styles.controlButton, {backgroundColor: this.props.themeKind == ThemeKind.Dark ? 'white' : '#2f5fb3'}]}>

                    <Text category="s1" style={[styles.controlButtonText, {color: this.props.themeKind == ThemeKind.Dark ? '#2f5fb3' : 'white'}]}>{'Back'}</Text>
                  </TouchableOpacity>
                </Animated.View>


                {/* Next Button */}
                <Animated.View style={{transform: [{scale: this.scaleNextButton}], opacity: this.scaleNextButton}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.nextWallet}
                    disabled={this.state.index === (this.props.totalWalletCount - 1) ? true : false }
                    style={[styles.controlButton, {backgroundColor: this.props.themeKind != ThemeKind.Dark ? '#2f5fb3' : 'white' }]}
                    >
                    <Text category="s1" style={[styles.controlButtonText, {color: this.props.themeKind == ThemeKind.Dark ? '#2f5fb3' : 'white'}]}>{'Next'}</Text>

                  </TouchableOpacity>
                </Animated.View>

            </View>
          </SafeAreaView>
        </View>
      </Layout>
    );
  }
 }

 // Helpers ----------------------------------------------------------------------------------------------
const slideIndicatorwidth: number = 7;
const slideIndicatorVerticalMargin: number = 10;
const slideIndicatorHorizontalMargin: number = 5;
const screenWidth: number = Dimensions.get('window').width;
// ------------------------------------------------------------------------------------------------------


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
  controlsViewContainer: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    width: '100%',
    zIndex: 100,
  },
  controlButtonsContainer: {
    width: '100%',
    paddingBottom: 25,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  controlButton: {
    aspectRatio: 1,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 100
  },
  controlButtonText: {
    color: 'white',
    textAlign: 'center'
  },
  slideIndexIndicatorContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slideIndexIndicator: {
    width: slideIndicatorwidth,
    aspectRatio: 1,
    marginVertical: slideIndicatorVerticalMargin,
    marginHorizontal: slideIndicatorHorizontalMargin,
    borderRadius: 100
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    start: 0,
    backgroundColor: '#009688'
  }
 });
 // ------------------------------------------------------------------------------------------


 // Connecting To Redux ----------------------------------------------------------------------
 function mapStateToProps(state: IGlobalState): any {
   return {
     walletItems: state.app.walletItems,
     totalWalletCount: state.app.totalWalletCount,
     isLoadingWalletItems: state.app.isLoadingWalletItems,
     walletLoadingError: state.app.walletLoadingError,
     themeKind: state.theme.themeKind
   };
 }
 // -----------

 function mapDispatchToProps(dispatch: Dispatch<any>): any {
   return {
     ...bindActionCreators({
      loadWalletItemsAsync,
      setThemeAsync,
     }, dispatch),
   };
 }
 // ----------------------------------

 const MainScreenConnected = connect(mapStateToProps, mapDispatchToProps)(MainScreenComponent);

 export const MainScreen = withStyles(MainScreenConnected, (theme: ThemeType) => ({
  textBasicColor: {
    controlButtonBgColor: theme['text-basic-color'],
  },
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