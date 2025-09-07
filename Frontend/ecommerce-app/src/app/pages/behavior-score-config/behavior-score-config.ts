import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RuleEditModal, Editable, BehaviorRule } from '../rule-edit-modal/rule-edit-modal';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-behavior-score-config',
  standalone: true,
  imports: [CommonModule, FormsModule, RuleEditModal],
  templateUrl: './behavior-score-config.html',
  styleUrls: ['../dashboard/dashboard.scss', './behavior-score-config.scss']
})
export class BehaviorScoreConfig {
  private token = environment.token;

  readonly q = signal('');

  readonly editing = signal<BehaviorRule | null>(null);

  private readonly data = signal<BehaviorRule[]>([]);

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

  constructor() {
    setTimeout(() => {this.fillData();}, 400);
  }

  trackBy = (_: number, r: BehaviorRule) => r.id;
  edit(r: BehaviorRule) { this.editing.set(r); }
  toggle(r: BehaviorRule) {
    const next = r.status === 'Ativo' ? 'Inativo' : 'Ativo';
    this.data.update(list => list.map(x => x.id === r.id ? { ...x, status: next } : x));
  }

  onSave(updated: Editable) {
    
    if (!isBehavior(updated)) {
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
  
  transformData(resp: any[]): BehaviorRule[] {
    let data: BehaviorRule[] = [];

    for(let item of resp) {
      data.push({
        kind: 'behavior',
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

      fetch("http://localhost:8080/api/v1/user-behavior-scores", {
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
  
        fetch("http://localhost:8080/api/v1/user-behavior-scores", {
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

function isBehavior(x: Editable | null): x is BehaviorRule {
  return !!x && x.kind === 'behavior';
}

