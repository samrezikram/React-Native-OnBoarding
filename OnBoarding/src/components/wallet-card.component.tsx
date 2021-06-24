import React from 'react';
import { View, Image, StyleSheet, Animated, TouchableWithoutFeedback, I18nManager, Platform } from 'react-native';

import { Layout, Text, withStyles, ThemeType } from 'react-native-ui-kitten';
import LinearGradient from 'react-native-linear-gradient';
import { bind as autobind, debounce } from 'lodash-decorators';

import { ITransaction } from '@models/app/transaction.model';

import _ from 'lodash';

 // Debounce Decorator Function Options
 const debOptions: object = {leading: true, trailing: false};

interface IWalletCardState {
  propsAreValid: boolean;
}

interface IWalletCardProps {
  onPress?: () => void;
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
        toValue: 0.5,
        duration: 50,
        useNativeDriver: true
      }).start();   
  }
  // ---------------------

    @autobind
  @debounce(500, debOptions)
  private onPressedOutAnimation(): void {
      Animated.spring(this.scaleValue, {
        toValue: 1.0,
        duration: 50,
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
          {'Wallet'}
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
           shadowRadius={8}
           >
           {
             <TouchableWithoutFeedback
              onPressIn={this.onPressedInAnimation()}
              onPressOut={this.onPressedOutAnimation()}>
                 <LinearGradient colors={ ['#1ce6eb', '#296fc5', '#3500A2']} style={styles.gradients}> 
                   <Image style={styles.image} 
                   source={I18nManager.isRTL ? require('./../../assets/lnd-shape-rtl.png') : require('./../../assets/lnd-shape.png')}/>
                   <Text style={styles.br} />
                   <Text
                     numberOfLines={1}
                     adjustsFontSizeToFit
                     style={[styles.balance]}>
                   {'$10.69'}
                   </Text>
                   <Text style={styles.br} />
                   <Text numberOfLines={1} style={[styles.cardNumber]}>
                     {"2720 9949 8572 6875"}
                   </Text>
                   <Text numberOfLines={1} style={[styles.cardName]}>
                     {"SAMREZ IKRAM"}
                   </Text>
                 </LinearGradient>
             </TouchableWithoutFeedback> 
           }
         </Animated.View>
       </Layout>
     );
  }
    
}


const platformIsAndroid: boolean = Platform.OS == 'android';

// Styles ------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    overflow: 'hidden'
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 0,
    marginHorizontal: 16,
  },
  headerText: {
    paddingTop: 16,
    fontWeight: 'bold',
    fontSize: 24,
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
    fontSize: 36,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
   walletCardRoot: {
    marginHorizontal: 16,
    marginVertical: 17,
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
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    fontSize: 24,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
   searchResultsListContainer: {
     flex: 1,
     paddingHorizontal: 16
   },

});
  // Export Component With Style Props From Theme -----------------
export const WalletCard = withStyles(WalletCardComponent, (theme: ThemeType) => ({
  cardBorderColor: {
    color: theme['background-basic-color-3']
  }
}));