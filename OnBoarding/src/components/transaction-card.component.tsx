import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Layout, Text, withStyles, ThemeType, StyleType } from 'react-native-ui-kitten';

import { bind as autobind } from 'lodash-decorators';

import { ITransaction } from '@models/app/transaction.model';

import _ from 'lodash';

interface ITransactionCardState {
  propsAreValid: boolean;
}

interface ITransactionCardProps {
  transaction: ITransaction;
  onPress?: () => void;
  themedStyle?: StyleType;
}

class TransactionCardComponent extends React.PureComponent<ITransactionCardProps, ITransactionCardState> {
  public state: ITransactionCardState = {} as ITransactionCardState;

  constructor(props: ITransactionCardProps) {
    super(props);
  }

  componentDidMount(): void {}
  // ---------------------

  @autobind
  private onCardPressed(): void {
    if (this.props.onPress && typeof this.props.onPress == 'function') {
      this.props.onPress();
    }
  }
  // ---------------------

  render(): React.ReactElement {
      return (
        <TouchableOpacity
          activeOpacity={this.props.onPress ? 0.6 : 1}
          onPress={this.onCardPressed}>
          <Layout level="1" style={styles.container}>

            {/* transaction details and description */}
            <View style={styles.transactionTitle}>
              {/* transaction  Title */}
              <Text category="s1" style={{color: '#2f5fb3', fontSize: 16, paddingLeft: 16}}>
                {`${this.props.transaction.title}`}
              </Text>
            </View>

            {/* Description */}
            <View>
              <Text category="s1" style={{fontSize: 10, paddingLeft: 16}}>{`${this.props.transaction.description }`}</Text>
            </View>

            {/* Separator Line */}
            <View style={styles.separator}/>

            <View style={styles.transactionType}>
              <Text category="c2" style={{fontSize: 8}}>{`Type : `}</Text>

              <View style={styles.stateDesc}>
                <Text style={[{fontSize: 10}]}>{`${this.props.transaction.title}`}</Text>
              </View>

            </View>

          </Layout>
        </TouchableOpacity>
      );
  }

}

// Styles ------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#296fc5',
    overflow: 'hidden'
  },
  transactionTitle: {
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    borderBottomColor: 'black',
    marginHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  transactionType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stateDesc: {
    height: 20,
    margin: 6,
    backgroundColor: 'skyblue',
    borderRadius: 20,
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
});

// Export Component With Style Props From Theme -----------------
export const TransactionCard = withStyles(TransactionCardComponent, (theme: ThemeType) => ({
  cardBorderColor: {
    color: theme['background-basic-color-3']
  }
}));
