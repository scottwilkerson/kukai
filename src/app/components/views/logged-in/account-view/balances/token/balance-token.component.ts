import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalComponent } from '../../../../../modals/modal.component';
import { Big } from 'big.js';
import { RemoveCommaPipe } from '../../../../../../pipes/remove-comma.pipe';
import { SubjectService } from '../../../../../../services/subject/subject.service';
import { WalletService } from '../../../../../../services/wallet/wallet.service';

@Component({
  selector: 'app-balance-token',
  templateUrl: './balance-token.component.html',
  styleUrls: ['../../../../../../../scss/components/views/logged-in/account-view/cards/balances/balance-token.component.scss']
})
export class BalanceTokenComponent implements OnInit {
  @Input() token = null;
  @Input() account;

  constructor(public removeCommaPipe: RemoveCommaPipe, private subjectService: SubjectService, private walletService: WalletService) {}
  ngOnInit(): void {}

  getBalance(): number | string {
    return this.token?.name === 'tezos'
      ? this.account?.availableBalance !== null
        ? Big(this.account?.availableBalance).div(1000000).toFixed()
        : undefined
      : this.token?.balance;
  }

  getBalanceFiat(): number | undefined {
    if (this.token?.name === 'tezos') {
      const available = this.account?.availableBalance !== null ? this.account?.availableBalance : 0;
      return Number((available / 1000000) * this.walletService.wallet.XTZrate);
    }
  }

  getStakedBalance(): Big | null {
    if (this.token?.name === 'tezos') {
      const staked = this.account?.stakedBalance !== null ? Big(this.account?.stakedBalance) : Big(0);

      const unstaked = this.account?.unstakedBalance !== null ? Big(this.account?.unstakedBalance) : Big(0);

      return staked.add(unstaked).div(1000000).toFixed();
    }
  }

  getStakedBalanceFiat(): number | undefined {
    if (this.token?.name === 'tezos') {
      const staked = this.account?.stakedBalance !== null ? this.account?.stakedBalance : 0;

      const unstaked = this.account?.unstakedBalance !== null ? this.account?.unstakedBalance : 0;

      return Number(((staked + unstaked) / 1000000) * this.walletService.wallet.XTZrate);
    }
  }

  viewToken(): void {
    if (this.token?.name !== 'tezos') {
      ModalComponent.currentModel.next({
        name: 'token-detail',
        data: this.token
      });
    }
  }

  buy() {
    ModalComponent.currentModel.next({
      name: 'buy',
      data: undefined
    });
  }

  showPendingUnstaked(): boolean {
    return this.account?.unstakedBalance !== null && this.account?.unstakedBalance > 0;
  }
}
