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
  styleUrls: ['../dashboard/dashboard.scss']
})
export class BehaviorScoreConfig {
  private token = environment.token;

  readonly q = signal('');

  readonly editing = signal<BehaviorRule | null>(null);

  private readonly data = signal<BehaviorRule[]>([
    { kind: 'behavior', id: 1, name: 'Page change difference less than 5 seconds', score: 10, status: 'Ativo'   },
    { kind: 'behavior', id: 2, name: 'Page change difference less than 2 seconds', score: 30, status: 'Ativo'   },
    { kind: 'behavior', id: 3, name: 'Mean clicks less than 5 seconds',            score: 20, status: 'Inativo' },
  ]);

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
    this.fillData();
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
    this.data.update(all => all.map(x => x.id === updated.id ? updated : x));
    this.editing.set(null);
  }



  fillData() {

    this.getBehaviorScoreData()
        .then((resp) => {
            let transformedData = this.transformData(resp);
            this.data.update(value => transformedData);
            
                    
            console.log("JSON: "+ JSON.stringify(resp));
            console.log("DATA: "+ transformedData);
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
  
}

function isBehavior(x: Editable | null): x is BehaviorRule {
  return !!x && x.kind === 'behavior';
}

