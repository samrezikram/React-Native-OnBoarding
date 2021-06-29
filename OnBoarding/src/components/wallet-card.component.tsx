import React from 'react';
import { View, Image, StyleSheet, Animated, TouchableWithoutFeedback, I18nManager, Dimensions } from 'react-native';

import { connect } from 'react-redux';
import { Layout, Text, withStyles, ThemeType, StyleType } from 'react-native-ui-kitten';
import LinearGradient from 'react-native-linear-gradient';
import { bind as autobind, debounce } from 'lodash-decorators';

import { IWallet } from '@models/app/wallet.model';

import _ from 'lodash';
import { IGlobalState } from '@models/app/global-state.model';
import { ThemeKind } from '@enums/theme-name.enum';

 // Debounce Decorator Function Options
 const debOptions: object = {leading: true, trailing: false};

 const walletLogo = require("./../assets/lnd-shape.png");
 const BitCoinLogo = require("./../assets/btc-shape.png");
 
 let logo: string;

interface IWalletCardState {
  propsAreValid: boolean;
}

interface IWalletCardProps {
  onPress?: () => void;
  wallet: IWallet;
  active: any,
  index: any,
  themedStyle?: StyleType;
  themeKind?: ThemeKind,
}

class WalletCardComponent extends React.PureComponent<IWalletCardProps, IWalletCardState> {
  public state: IWalletCardState = {} as IWalletCardState;

  constructor(props: IWalletCardProps) {
    super(props);
  }

  componentDidMount(): void {}
  // ---------------------

  private scaleValue = new Animated.Value(1.0);


  @autobind
  @debounce(500, debOptions)
  private onPressedInAnimation(): void {
      Animated.spring(this.scaleValue, {
        toValue: 0.95,
        useNativeDriver: true
      }).start();   
  }
  // ---------------------

    @autobind
  @debounce(500, debOptions)
  private onPressedOutAnimation(): void {
      Animated.spring(this.scaleValue, {
        toValue: 1.0,
        useNativeDriver: true
      }).start();   
  }
  // ---------------------

  @autobind
  private onWalletPressed(): void {
    if (this.props.onPress && typeof this.props.onPress == 'function') {
      this.props.onPress();
    }
  }
  // ---------------------


  private renderListHeaderComponent() {
    return (
      <View style={[styles.walletHeader]}>
        <Text textBreakStrategy="simple" style={[styles.headerText]}>
          {this.props.wallet.cardType}
        </Text>
      </View>
    );
  };


  render(): React.ReactElement {
    return (
      <Layout level="2" style={styles.container}>
        {this.renderListHeaderComponent()}
         <Animated.View
           style={[styles.walletCardRoot, { opacity: 0.5, transform: [{ scale: this.scaleValue }] }]}
           shadowOpacity={25 / 100}
           shadowOffset={{ width: 0, height: 3 }}
           shadowRadius={8}>
           {
             <TouchableWithoutFeedback
              onPressIn={this.onPressedInAnimation}
              onPressOut={this.onPressedOutAnimation}
              onPress={this.onWalletPressed}>
                 <LinearGradient colors={ ['#1ce6eb', '#296fc5', '#2f5fb3'] } style={styles.gradients}> 
                   <Image style={styles.image} 
                    source={this.props.wallet.cardType === 'Wallet'? walletLogo : BitCoinLogo}/>
                   <Text style={styles.br} />
                   <Text
                     numberOfLines={1}
                     adjustsFontSizeToFit
                     style={[styles.balance]}>
                   {`${this.props.wallet.balance}`}
                   </Text>
                   <Text style={styles.br} />
                   <Text numberOfLines={1} style={[styles.cardNumber]}>
                     {this.props.wallet.cardNumber}
                   </Text>
                   <Text numberOfLines={1} style={[styles.cardName]}>
                     {this.props.wallet.cardHolderName}
                   </Text>
                 </LinearGradient>
             </TouchableWithoutFeedback> 
           }
         </Animated.View>
       </Layout>
     );
  }
    
}


 // Helpers ----------------------------------------------------------------------------------------------
 const screenWidth: number = Dimensions.get('window').width;
 // ------------------------------------------------------------------------------------------------------
 
// Styles ------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    width: screenWidth/4 ,
    justifyContent: 'center',
    alignContent: 'center',
  },
  walletCardRoot: {
    marginHorizontal: 5,
    marginVertical: 12,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'cover',
    paddingTop: 0,
    marginHorizontal: 16,
  },
  headerText: {
    paddingTop: 16,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2f5fb3'
  },
  image: {
    width: 99,
    height: 94,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12
  },
  balance: {
    paddingTop: 16,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  gradients: {
    padding: 15,
    borderRadius: 12,
    minHeight: 190,
  },
  br: {
    backgroundColor: 'transparent',
  },
  cardNumber: {
    paddingTop: 50,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    color: 'rgb(192,192,192)',
    fontSize: 10,
  },
  cardName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
   searchResultsListContainer: {
     flex: 1,
     paddingHorizontal: 16
   },

});

 // Connecting To Redux ----------------------------------------------------------------------
 function mapStateToProps(state: IGlobalState): any {
  return {
    themeKind: state.theme.themeKind
  };
}

const WalletCardComponentConnected = connect(mapStateToProps)(WalletCardComponent);

// -----------
  // Export Component With Style Props From Theme -----------------
export const WalletCard = withStyles(WalletCardComponentConnected, (theme: ThemeType) => ({
  cardBorderColor: {
    color: theme['background-basic-color-3']
  }
}));