import { Injectable, signal } from '@angular/core'

export interface NotifyPayload {
  level: 'info' | 'success' | 'warning' | 'error'
  title: string
  body: string
  source: string
}

interface ToastItem extends NotifyPayload {
  id: number
}

const EVENT_NAME = 'poc:notify'

let nextId = 1

/**
 * ** POC ** Service d'écoute des CustomEvent `poc:notify` émis sur window
 * par n'importe quelle app de la page (legacy, micro-frontends).
 *
 * Démontre le second mécanisme cross-app demandé (en complément de shared-bus
 * pour l'état partagé). Les événements sont fire-and-forget : chaque
 * notification s'affiche puis disparaît automatiquement.
 */
@Injectable({ providedIn: 'root' })
export class NotifyService {
  private readonly toastList = signal<ReadonlyArray<ToastItem>>([])

  readonly toasts = this.toastList.asReadonly()

  constructor() {
    window.addEventListener(EVENT_NAME, this.onNotify as EventListener)
  }

  /**
   * Affiche manuellement une notification (utilisé en interne par le shell).
   *
   * @param payload Données de la notification.
   */
  push(payload: NotifyPayload): void {
    const id = nextId++
    this.toastList.update(list => [...list, { ...payload, id }])
    setTimeout(() => this.dismiss(id), 4500)
  }

  /**
   * Retire une notification (manuellement ou via timeout).
   *
   * @param id Identifiant unique de la notification.
   */
  dismiss(id: number): void {
    this.toastList.update(list => list.filter(t => t.id !== id))
  }

  /**
   * Handler attaché à window — extrait le detail du CustomEvent et pousse
   * la notification dans la liste. Fonction fléchée pour préserver `this`.
   */
  private readonly onNotify = (event: Event): void => {
    const custom = event as CustomEvent<NotifyPayload>
    const detail = custom.detail
    if (!detail || !detail.title) return
    this.push(detail)
  }
}
