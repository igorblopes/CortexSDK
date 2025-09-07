import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RuleEditModal, Editable, CheckoutRule } from '../rule-edit-modal/rule-edit-modal';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-checkout-score-config',
  standalone: true,
  imports: [CommonModule, FormsModule, RuleEditModal],
  templateUrl: './checkout-score-config.html',
  styleUrls: ['../dashboard/dashboard.scss', './checkout-score-config.scss']
})
export class CheckoutScoreConfig {
  private token = environment.token;

  readonly q = signal('');

  readonly editing = signal<CheckoutRule | null>(null);

  private readonly data = signal<CheckoutRule[]>([]);

  constructor() {
    setTimeout(() => {this.fillData();}, 500);
  }


  readonly rows = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.data();
    return this.data().filter(r =>
      String(r.id).includes(t) ||
      r.name.toLowerCase().includes(t) ||
      String(r.score).includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  });

  trackBy = (_: number, r: CheckoutRule) => r.id;
  edit(r: CheckoutRule) { this.editing.set(r); }


  onSave(updated: Editable) {
      
    if (!isCheckout(updated)) {
      console.warn('Tipo inesperado no save do Behavior:', updated);
      return;
    }

    let request = {
      id: updated.id,
      score: updated.score,
      status: "Ativo" == updated.status ? 1 : 0
    }
    this.updatedBehaviorScoreData(request)
        .then(() => {
          this.data.update(all => all.map(x => x.id === updated.id ? updated : x));
          this.editing.set(null);      
        })
        .catch((err) => console.error(err))

    
  }
  
  
  
    fillData() {
  
      this.getBehaviorScoreData()
          .then((resp) => {
              let transformedData = this.transformData(resp);
              this.data.update(value => transformedData);
          })
          .catch((err) => console.error(err));
  
    }
    
    transformData(resp: any[]): CheckoutRule[] {
      let data: CheckoutRule[] = [];
  
      for(let item of resp) {
        data.push({
          kind: 'checkout',
          id: item.id,
          name: item.name,
          score: item.score,
          status: item.status == 1 ? "Ativo": "Inativo"
        })
      }
  
      return data;
    }
  
    async getBehaviorScoreData(): Promise<any> {
  
        return await new Promise<void>((resolve, reject) => {
  
        fetch("http://localhost:8080/api/v1/checkout-scores", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.token
            }
        })
        .then((resp) => {
  
          resp.json()
              .then((json) => {
  
                resolve(json)
  
  
              })
              .catch((err) => reject(err))
  
        })
        .catch((err) => reject(err));
  
        });
    } 


    async updatedBehaviorScoreData(data: any): Promise<any> {
  
        return await new Promise<void>((resolve, reject) => {
  
        fetch("http://localhost:8080/api/v1/checkout-scores", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.token
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
  
          resp.json()
              .then((json) => {
  
                resolve(json)
  
  
              })
              .catch((err) => reject(err))
  
        })
        .catch((err) => reject(err));
  
        });
    }
}

function isCheckout(x: Editable | null): x is CheckoutRule {
  return !!x && x.kind === 'checkout';
}